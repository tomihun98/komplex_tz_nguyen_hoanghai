const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const { request } = require("http");
const { error } = require("console");
app.use(cors());
app.use(bodyparser.json());

const db = mysql.createConnection(
    {
        user: "root",
        host: "localhost",
        port: 3307,
        password: "",
        database: "felveteli"
    }
)

// a szerver futásának ellenőrzése

app.get("/", (req, res) => {
    res.send("A szerver működik !")
}

)

app.get('/1', (req, res) => {
    const { agazat } = req.query; 

    if (!agazat) {
        return res.status(400).json({ error: 'Nincs megadva az agazat paraméter' });
    }

    // Paraméterezett SQL lekérdezés
    const sql = `
    SELECT t.agazat, COUNT(j.diak) AS jelentkezo_szam, SUM(d.hozott + d.kpmagy + d.kpmat) AS osszpontszam
    FROM tagozatok t
    INNER JOIN jelentkezesek j ON t.akod = j.tag
    INNER JOIN diakok d ON j.diak = d.oktazon
    WHERE t.agazat = ? AND j.hely = 1
    GROUP BY t.agazat
    ORDER BY jelentkezo_szam DESC;
    `;

    // Lekérdezés végrehajtása a db.query metódussal
    db.query(sql, [agazat], (err, result) => {
        if (err) return res.status(500).json({ error: err.message }); // Hibakezelés
        return res.json(result); // Eredmény visszaküldése
    });
});



app.get("/2", (req, res) => {
    const sql = `
        SELECT
            d.nev AS 'Tanulo neve',
            t.agazat AS 'Agazat',
            (d.hozott * 2 + d.kpmagy + d.kpmat) AS 'Osszes pontszam'
        FROM
            diakok d
            INNER JOIN jelentkezesek j ON d.oktazon = j.diak
            INNER JOIN tagozatok t ON j.tag = t.akod
        WHERE
            j.hely = 1
        ORDER BY
            t.agazat ASC,
            (d.hozott * 2 + d.kpmagy + d.kpmat) DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});


app.get("/3", (req, res) => {

    const sql = "SELECT * FROM `tagozatok` WHERE 1";
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    }
    )
}
)

app.post("/", (req, res) => {
    const sql = "";
    const values = [req.body.ID, req.body.versenyzo];
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({error: "hibás adatbázis művelet !"});
        return res.json(result);
    }
    )
}
)


app.listen(3000, () => {
    console.log('A szerver a 3000 porton fut!')
})

