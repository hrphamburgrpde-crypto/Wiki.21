const db = require("../database/database");

function createPage(title, content, author) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO pages(title, content, author) VALUES(?,?,?)",
            [title, content, author],
            err => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

function getPage(title) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM pages WHERE title = ?",
            [title],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
}

function editPage(title, content) {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE pages SET content = ? WHERE title = ?",
            [content, title],
            err => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

function deletePage(title) {
    return new Promise((resolve, reject) => {
        db.run(
            "DELETE FROM pages WHERE title = ?",
            [title],
            err => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

function listPages() {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT title FROM pages ORDER BY title ASC",
            [],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

module.exports = {
    createPage,
    getPage,
    editPage,
    deletePage,
    listPages
};