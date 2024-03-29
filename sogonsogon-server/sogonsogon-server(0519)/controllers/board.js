const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);

const { formatting_datetime, param, error } = require('../utils');

const controller = {
    async createBoard(req, res, next) {
        try {
            const body = req.body
            const user_no = req.users.user_no;
            const title = param(body, 'title')
            const content = param(body, 'content')
            const category = param(body, 'category')
            const category_no = param(req.body, 'category_no')

            let region_no = null;
            let sector_no = null;

            if (category === 'region') region_no = category_no;
            else if (category == 'sector') sector_no = category_no;
            else throw error(`category 를 정확하게 입력해주세요`)

            const connection = await pool.getConnection(async (conn) => conn);
            try {
                await connection.beginTransaction();
                await connection.query(
                    `
                INSERT INTO 
                boards(user_no, title, content, region_bcode, sector_no)
                VALUE (?, ?, ?, ?, ?);
                `,
                    [user_no, title, content, region_no, sector_no]
                );
                await connection.commit();
                next({ message: `게시글이 정상적으로 등록되었습니다.` })
            } catch (e) {
                await connection.rollback();
                next(e);
            } finally {
                connection.release();
            }
        } catch (e) {
            next(e);
        }
    },
    async editBoard(req, res, next) {
        try {
            const user_no = req.users.user_no;

            const body = req.body
            const board_no = param(body, 'board_no')
            const title = param(body, 'title')
            const content = param(body, 'content')
            const category = param(body, 'category')
            const category_no = param(body, 'category_no')

            const [result] = await pool.query(
                `
                SELECT *
                FROM boards
                WHERE no = ?
                AND user_no = ?
                AND enabled = 1;
                `,
                [board_no, user_no]
            );
            if (result.length < 1) throw error(`게시글이 존재하지 않거나 수정 권한이 없습니다.`);
            else {
                const connection = await pool.getConnection(async (conn) => conn);
                try {
                    await connection.beginTransaction();

                    let region_bcode = null;
                    let sector_no = null;

                    if (category === 'region') region_bcode = category_no;
                    else if (category == 'sector') sector_no = category_no;
                    else throw error(`category 를 정확하게 입력해주세요`)

                    await connection.query(
                        `
                    UPDATE boards
                    SET 
                    title = ?,
                    content = ?,
                    region_bcode = ?,
                    sector_no = ?
                    WHERE no = ?
                    AND enabled = 1;
                    `,
                        [title, content, region_bcode, sector_no, board_no]
                    );
                    await connection.commit();
                    next({ message: `게시글이 정상적으로 변경되었습니다.` })
                } catch (e) {
                    await connection.rollback();
                    next(e);
                } finally {
                    connection.release();
                }
            }
        } catch (e) {
            next(e);
        }
    },
    async removeBoard(req, res, next) {
        try {
            const query = req.query
            const user_no = req.users.user_no;
            const board_no = param(query, 'board_no')

            const [result1] = await pool.query(
                `
                SELECT
                COUNT(*) AS 'count'
                FROM boards
                WHERE enabled = 1
                AND user_no = ?
                AND no = ?;
            `,
                [user_no, board_no]
            );
            if (result1[0].count < 1) throw error(`해당 게시글이 존재하지 않거나 해당 게시글 삭제 권한이 없습니다.`);

            const connection = await pool.getConnection(async (conn) => conn);
            try {
                await connection.beginTransaction();

                await connection.query(`
                UPDATE boards b
                LEFT JOIN comments c
                ON c.board_no = b.no
                SET b.remove_datetime = NOW(),
                c.remove_datetime = NOW(),
                b.enabled = 0,
                c.enabled = 0
                WHERE b.no = ?
                AND b.enabled = 1
                `, [board_no])

                await connection.commit();
                next({ message: `게시글이 정상적으로 삭제되었습니다.` })
            } catch (e) {
                await connection.rollback();
                next(e);
            } finally {
                connection.release();
            }
        } catch (e) {
            next(e);
        }
    },
    async board(req, res, next) {
        try {
            const query = req.query
            const user_no = req.users.user_no;
            const board_no = param(query, 'board_no')

            const [results] = await pool.query(
                `
                SELECT 
                b.no AS 'board_no',
                b.user_no,
                u.nickname,
                b.region_bcode,
                b.sector_no,
                b.user_no,
                b.title AS 'board_title',
                b.content AS 'board_content',
                b.views,
                b.likes,
                comments,
                b.create_datetime,
                b.update_datetime,
                b.remove_datetime
                FROM boards AS b
                LEFT OUTER JOIN (
                    SELECT COUNT(*) AS 'comments', board_no
                    FROM comments 
                    WHERE board_no = ?
                    AND enabled = 1
                ) AS c 
                ON b.no = c.board_no
                INNER JOIN users u
                ON u.no = b.user_no
                WHERE b.no = ?
                AND b.enabled = 1;
                `,
                [board_no, board_no]
            );
            if (results.length < 1) throw error(`해당 게시글이 존재하지 않습니다.`)
            const is_mine = user_no === results[0].user_no ? true : false;
            results[0].comments = results[0].comments === null ? 0 : results[0].comments
            const category = results[0].region_bcode === null ? 'sector' : 'region'

            const [like] = await pool.query(`
                SELECT *
                FROM likes
                WHERE user_no = ?
                AND board_no = ?
                `, [user_no, board_no]);

            const is_like = like.length === 0 ? true : false;
            const connection = await pool.getConnection(async (conn) => conn);
            try {
                await connection.beginTransaction();
                await connection.query(
                    `
                        UPDATE boards
                        SET 
                        views = IFNULL(views, 0) + 1
                        WHERE no = ?
                        AND enabled = 1;
                        `,
                    [board_no]
                ); // 조회수 수정

                formatting_datetime(results);
                await connection.commit();
                next({ is_like, is_mine, category, ...results[0] })
            } catch (e) {
                await connection.rollback();
                next(e);
            } finally {
                connection.release();
            }
        } catch (e) {
            //throw e;
            next(e);
        }
    },
    async likeUp(req, res, next) {
        try {
            const user_no = req.users.user_no

            const query = req.query
            const board_no = param(query, 'board_no')
            const [result] = await pool.query(
                `
            SELECT *
            FROM boards
            WHERE no = ?
            AND enabled = 1;
            `,
                [board_no]
            );
            if (result.length < 1) throw error(`게시글이 존재하지 않습니다.`);
            const connection = await pool.getConnection(async (conn) => conn);
            try {
                const [like] = await pool.query(`
                SELECT *
                FROM likes
                WHERE user_no = ?
                AND board_no = ?
                `, [user_no, board_no])

                if (like.length >= 1) throw error(`좋아요 불가. 이미 좋아요가 되어있습니다.`)

                await connection.beginTransaction();
                await connection.query(
                    `INSERT INTO likes
                    (user_no, board_no)
                    VALUES (?, ?);
                    `,
                    [user_no, board_no]
                );

                await connection.query(
                    `
                    UPDATE boards
                    SET 
                    likes = IFNULL(likes, 0) + 1
                    WHERE no = ?
                    AND enabled = 1;
                    `,
                    [board_no]
                );

                await connection.commit();
                next({ message: `좋아요 완료` })
            } catch (e) {
                await connection.rollback();
                next(e);
            } finally {
                connection.release();
            }

        } catch (e) {
            next(e);
        }
    },
    async likeDown(req, res, next) {
        try {
            const user_no = req.users.user_no

            const query = req.query
            const board_no = param(query, 'board_no')
            const [result] = await pool.query(
                `
            SELECT *
            FROM boards
            WHERE no = ?
            AND enabled = 1;
            `,
                [board_no]
            );
            if (result.length < 1) throw error(`게시글이 존재하지 않습니다.`);

            const connection = await pool.getConnection(async (conn) => conn);
            try {
                const [like] = await pool.query(`
                SELECT *
                FROM likes
                WHERE user_no = ?
                AND board_no = ?
                `, [user_no, board_no])

                if (like.length < 1) throw error(`좋아요 취소 불가. 이미 좋아요 취소가 되어있습니다.`)

                await connection.beginTransaction();
                await connection.query(`
                    DELETE 
                    FROM likes
                    WHERE user_no = ?
                    AND board_no = ?
                    `, [user_no, board_no])
                await connection.query(
                    `
                    UPDATE boards
                    SET 
                    likes = IFNULL(likes, 0) - 1
                    WHERE no = ?
                    AND enabled = 1;
                    `,
                    [board_no]
                );

                await connection.commit();
                next({ message: `좋아요 취소` })
            } catch (e) {
                await connection.rollback();
                next(e);
            } finally {
                connection.release();
            }
        } catch (e) {
            next(e);
        }
    },
    async myBoards(req, res, next) {
        try {
            const query = req.query
            const user_no = req.users.user_no
            const count = param(query, 'count')
            const page = param(query, 'page')

            const [result] = await pool.query(
                `
                SELECT COUNT(*) AS 'total_count'
                FROM boards 
                WHERE user_no = ?
                AND enabled = 1;
                `, [user_no])

            const [results] = await pool.query(
                `
                SELECT 
                b.no AS 'board_no',
                b.user_no,
                u.nickname,
                b.region_bcode,
                b.sector_no,
                b.title AS 'board_title',
                b.content AS 'board_content',
                b.views,
                b.likes,
                comments,
                b.create_datetime,
                b.update_datetime,
                b.remove_datetime
                FROM boards AS b
                LEFT OUTER JOIN(
                    SELECT COUNT(*) AS 'comments', board_no
                    FROM comments
                    WHERE enabled = 1
                    GROUP BY board_no
                ) AS c
                ON b.no = c.board_no
                INNER JOIN users u
                ON u.no = b.user_no && b.user_no = ?
                WHERE b.enabled = 1
                ORDER BY b.create_datetime DESC
                LIMIT ? OFFSET ?
            `, [user_no, Number(count), Number(page * count)]
            );
            results.map((result) => result.comments = result.comments === null ? 0 : result.comments)
            formatting_datetime(results);

            next({ ...result[0], results })
        } catch (e) {
            next(e);
        }
    },
    async bestOfBoards(req, res, next) {
        try {
            const query = req.query
            let category = param(query, 'category')
            const category_no = param(query, 'category_no')

            let region_no = null;
            let sector_no = null;

            if (category === 'region') region_no = category_no;
            else if (category == 'sector') sector_no = category_no;
            else throw error(`category 를 정확하게 입력해주세요`)

            const [results] = await pool.query(
                `
                SELECT 
                b.no AS 'board_no',
                b.user_no,
                u.nickname,
                b.region_bcode,
                b.sector_no,
                b.title AS 'board_title',
                b.content AS 'board_content',
                b.views,
                b.likes,
                comments,
                b.create_datetime,
                b.update_datetime,
                b.remove_datetime
                FROM boards AS b
                LEFT OUTER JOIN(
                    SELECT COUNT(*) AS 'comments', board_no
                    FROM comments
                    WHERE enabled = 1
                    GROUP BY board_no
                ) AS c
                ON b.no = c.board_no
                LEFT OUTER JOIN users u
                ON u.no = b.user_no
                WHERE (b.region_bcode = ?
                OR b.sector_no = ?)
                AND b.enabled = 1
                ORDER BY b.likes DESC, comments DESC, b.views DESC
                LIMIT 5;
                `, [region_no, sector_no]
            );

            results.map((result) => result.comments = result.comments === null ? 0 : result.comments)
            formatting_datetime(results);

            next({ results })
        } catch (e) {
            next(e);
        }
    },
    async allOfBoards(req, res, next) {
        try {
            const body = req.query
            const page = param(body, 'page')
            const count = param(body, 'count')
            let category = param(body, 'category')
            const category_no = param(body, 'category_no')

            let region_no = null;
            let sector_no = null;

            if (category === 'region') region_no = category_no;
            else if (category == 'sector') sector_no = category_no;
            else throw error(`category 를 정확하게 입력해주세요`)

            const [result] = await pool.query(
                `
                SELECT COUNT(*) AS 'total_count'
                FROM boards 
                WHERE (region_bcode = ?
                OR sector_no = ?)
                AND enabled = 1
                `, [region_no, sector_no])

            const [results] = await pool.query(
                `
                SELECT 
                b.no AS 'board_no',
                b.user_no,
                u.nickname,
                b.region_bcode,
                b.sector_no,
                b.title AS 'board_title',
                b.content AS 'board_content',
                b.views,
                b.likes,
                comments,
                b.create_datetime,
                b.update_datetime,
                b.remove_datetime
                FROM boards AS b
                LEFT OUTER JOIN(
                    SELECT COUNT(*) AS 'comments', board_no
                    FROM comments
                    WHERE enabled = 1
                    GROUP BY board_no
                ) AS c
                ON (b.no = c.board_no)
                LEFT OUTER JOIN users u
                ON u.no = b.user_no
                WHERE (b.region_bcode = ?
                OR b.sector_no = ?)
                AND b.enabled = 1
                ORDER BY b.create_datetime DESC
                LIMIT ? OFFSET ?
                `,
                [region_no, sector_no, Number(count), Number(page * count)]
            );

            results.map((result) => result.comments = result.comments === null ? 0 : result.comments)
            formatting_datetime(results);

            next({ ...result[0], results })
        } catch (e) {
            next(e);
        }
    },
    async searchedBoards(req, res, next) {
        try {
            const query = req.query
            const search = param(query, 'search')
            const page = param(query, 'page')
            const count = param(query, 'count')

            const [result] = await pool.query(
                `
                SELECT COUNT(*) AS 'total_count'
                FROM boards 
                WHERE (title LIKE ?
                OR content LIKE ?)
                AND enabled = 1
                `, [`%${search}%`, `%${search}%`])

            const [results] = await pool.query(
                `
                SELECT 
                b.no AS 'board_no',
                b.user_no,
                u.nickname,
                b.region_bcode,
                b.sector_no,
                b.title,
                b.content,
                b.views,
                b.likes,
                comments,
                b.create_datetime,
                b.update_datetime,
                b.remove_datetime
                FROM boards AS b
                LEFT OUTER JOIN(
                    SELECT COUNT(*) AS 'comments', board_no
                    FROM comments
                    WHERE enabled = 1
                    GROUP BY board_no
                ) AS c
                ON (b.no = c.board_no)
                LEFT OUTER JOIN users u
                ON u.no = b.user_no
                WHERE (b.title LIKE ?
                OR b.content LIKE ?)
                AND b.enabled = 1
                ORDER BY b.create_datetime DESC
                LIMIT ? OFFSET ?
                `,
                [`%${search}%`, `%${search}%`, Number(count), Number(page * count)]
            );

            results.map((result) => result.comments = result.comments === null ? 0 : result.comments)
            formatting_datetime(results);
            next({ ...result[0], results })
        } catch (e) {
            next(e);
        }
    },
};

module.exports = controller;
