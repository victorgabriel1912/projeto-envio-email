const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
    res.render("pages/index", { mensagem: "", erro: "" });
});

router.post("/enviar-email", async (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;

    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).render("pages/index", {
            mensagem: "",
            erro: "Preencha todos os campos antes de enviar."
        });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_DESTINO) {
        return res.status(500).render("pages/index", {
            mensagem: "",
            erro: "Configure EMAIL_USER, EMAIL_PASS e EMAIL_DESTINO no arquivo .env."
        });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_DESTINO,
            replyTo: email,
            subject: `Contato pelo site: ${assunto}`,
            text: `Nome: ${nome}\nE-mail de retorno: ${email}\n\nMensagem:\n${mensagem}`,
            html: `<h2>Novo contato pelo site</h2>
                   <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
                   <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
                   <p><strong>Assunto:</strong> ${escapeHtml(assunto)}</p>
                   <p><strong>Mensagem:</strong><br>${escapeHtml(mensagem).replace(/\n/g, "<br>")}</p>`
        });

        return res.render("pages/index", {
            mensagem: "E-mail enviado com sucesso!",
            erro: ""
        });
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error.message);
        return res.status(500).render("pages/index", {
            mensagem: "",
            erro: "Não foi possível enviar o e-mail. Confira as configurações do Gmail no arquivo .env."
        });
    }
});

function escapeHtml(valor) {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

module.exports = router;
