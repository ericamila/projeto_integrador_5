const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;
const DB_SOURCE = "database.db"; 

app.use(cors());
app.use(express.json());

// ----------------- CONEXÃO COM O BANCO DE DADOS E CRIAÇÃO DAS TABELAS -----------------

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Conectado ao banco de dados.');
        db.run(`CREATE TABLE IF NOT EXISTS fornecedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cnpj TEXT UNIQUE,
            endereco TEXT,
            telefone TEXT,
            email TEXT,
            contato TEXT,
            CONSTRAINT cnpj_unique UNIQUE (cnpj)
        )`, (err) => {
            if (err) {
                console.error("Erro ao criar tabela 'fornecedores':", err.message);
            } else {
                console.log("Tabela 'fornecedores' OK.");
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            codigoBarras TEXT UNIQUE,
            descricao TEXT,
            quantidade INTEGER,
            categoria TEXT,
            dataValidade TEXT,
            imagem TEXT,
            CONSTRAINT codigoBarras_unique UNIQUE (codigoBarras)
        )`, (err) => {
            if (err) {
                console.error("Erro ao criar tabela 'produtos':", err.message);
            } else {
                console.log("Tabela 'produtos' OK.");
            }
        });

        // Tabela de Associação (relação Muitos-para-Muitos entre Produtos e Fornecedores)
        db.run(`CREATE TABLE IF NOT EXISTS produto_fornecedor (
            produtoId INTEGER,
            fornecedorId INTEGER,
            FOREIGN KEY(produtoId) REFERENCES produtos(id),
            FOREIGN KEY(fornecedorId) REFERENCES fornecedores(id),
            PRIMARY KEY (produtoId, fornecedorId)
        )`, (err) => {
            if (err) {
                console.error("Erro ao criar tabela 'produto_fornecedor':", err.message);
            } else {
                console.log("Tabela 'produto_fornecedor' OK.");
            }
        });
    }
});


// ----------------- ROTAS DA API  -----------------

// Rota raiz para teste
app.get("/", (req, res) => {
    res.json({ "message": "API de Gestão de Estoque está funcionando!" });
});

// --- ROTAS DE FORNECEDORES ---

app.get("/api/fornecedores", (req, res) => {
    const sql = "SELECT * FROM fornecedores";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.post("/api/fornecedores", (req, res) => {
    const { nome, cnpj, endereco, telefone, email, contato } = req.body;
    
    if (!nome || !cnpj) {
        res.status(400).json({ "error": "Nome e CNPJ são obrigatórios." });
        return;
    }

    const sql = `INSERT INTO fornecedores (nome, cnpj, endereco, telefone, email, contato) VALUES (?,?,?,?,?,?)`;
    const params = [nome, cnpj, endereco, telefone, email, contato];
    
    db.run(sql, params, function(err) {
        if (err) {
            // Verifica se o erro é de violação de constraint (CNPJ duplicado)
            if (err.message.includes("UNIQUE constraint failed")) {
                res.status(409).json({ "error": "Fornecedor com este CNPJ já está cadastrado!" });
            } else {
                res.status(400).json({ "error": err.message });
            }
            return;
        }
        res.status(201).json({
            "message": "Fornecedor cadastrado com sucesso!",
            "data": { id: this.lastID, ...req.body }
        });
    });
});


// --- ROTAS DE PRODUTOS ---
app.get("/api/produtos", (req, res) => {
    const sql = "SELECT * FROM produtos";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.post("/api/produtos", (req, res) => {
    const { nome, codigoBarras, descricao, quantidade, categoria, dataValidade, imagem } = req.body;

    if (!nome || !codigoBarras) {
        res.status(400).json({ "error": "Nome e Código de Barras são obrigatórios." });
        return;
    }

    const sql = `INSERT INTO produtos (nome, codigoBarras, descricao, quantidade, categoria, dataValidade, imagem) VALUES (?,?,?,?,?,?,?)`;
    const params = [nome, codigoBarras, descricao, quantidade, categoria, dataValidade, imagem];

    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                res.status(409).json({ "error": "Produto com este código de barras já está cadastrado!" });
            } else {
                res.status(400).json({ "error": err.message });
            }
            return;
        }
        res.status(201).json({
            "message": "Produto cadastrado com sucesso!",
            "data": { id: this.lastID, ...req.body }
        });
    });
});


// --- ROTAS DE ASSOCIAÇÃO ---

app.get("/api/associacoes", (req, res) => {
    const sql = "SELECT * FROM produto_fornecedor";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        // Transforma a lista de associações em um objeto, como esperado pelo frontend
        const associacoesObjeto = rows.reduce((acc, item) => {
            if (!acc[item.produtoId]) {
                acc[item.produtoId] = [];
            }
            acc[item.produtoId].push(item.fornecedorId);
            return acc;
        }, {});
        
        res.json({
            "message": "success",
            "data": associacoesObjeto
        });
    });
});

app.post("/api/associacoes", (req, res) => {
    const { produtoId, fornecedorId } = req.body;

    if (!produtoId || !fornecedorId) {
        res.status(400).json({ "error": "ID do Produto e ID do Fornecedor são obrigatórios." });
        return;
    }

    const sql = `INSERT INTO produto_fornecedor (produtoId, fornecedorId) VALUES (?,?)`;
    db.run(sql, [produtoId, fornecedorId], function(err) {
        if (err) {
            if (err.message.includes("PRIMARY KEY constraint failed")) {
                res.status(409).json({ "error": "Fornecedor já está associado a este produto!" });
            } else {
                res.status(400).json({ "error": err.message });
            }
            return;
        }
        res.status(201).json({ "message": "Fornecedor associado com sucesso ao produto!" });
    });
});

app.delete("/api/associacoes", (req, res) => {
    const { produtoId, fornecedorId } = req.body;

    if (!produtoId || !fornecedorId) {
        res.status(400).json({ "error": "ID do Produto e ID do Fornecedor são obrigatórios." });
        return;
    }

    const sql = `DELETE FROM produto_fornecedor WHERE produtoId = ? AND fornecedorId = ?`;
    db.run(sql, [produtoId, fornecedorId], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (this.changes > 0) {
            res.json({ "message": "Fornecedor desassociado com sucesso!" });
        } else {
            res.status(404).json({ "message": "Associação não encontrada." });
        }
    });
});


app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});
