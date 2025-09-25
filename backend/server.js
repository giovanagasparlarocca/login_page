const express = require("express")
const fs = require("fs");
const { request } = require("http");
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors");

const app= express();
const port = 5001;
app.use(cors());
app.use(express.json());

//Criar uma string para renovar a chave de autenticação
const SECRET_KEY="123456789910";

//local onde esta o arquivo do banco de dados 
const localDados = path.join(__dirname, 'data/usuarios.json')

// função para ler os dados do arquivo 
const consultarUsuarios=()=>{

    const data = fs.readFileSync(localDados, "utf-8");
    return JSON.parse(data);
}

//função para gravar dados no arquivo 
const salvarUsuarios= (users)=>{
    fs.writeFileSync(localDados, JSON.stringify(users, null, 2))
}

//rota para registrar ustuario
app.post("/register", async(req,res)=>{
    const {email,senha}= req.body;
    if(!email || !senha){
        return res.status(400).json({message:"campos obrigatorios"})

    }
    const users= consultarUsuarios();
    if(users.find(user=>user.email==email)){
        return res.status(400).json({message:"email ja cadastrado no banco de dados"})
    }
    //criptografar a senha 
    const hashSenha = await bcrypt.hash(senha,10)
    const novoUsuario = {id:Date.now,email, senha:hashSenha};
    users.push(novoUsuario);
    salvarUsuarios(users);
    res.status(200).json({"message: usuario registrado com sucesso"})

})
//rota login
app.post("/login", async (req,res)=>{
    const {email, senha}= req.body
    const users= consultarUsuarios();
    const user = user.find(user=>user.email === email);
    if (!user){
       return res.status(400).json({message:"usuario ou senha invalidos"}) 
    }
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if(!senhaValida){
        return res.status(400).json({message:"senha inválida"}) 

    }
    //autenticação do 
    const token= jwt.sign({id:user.id,email:senha},SECRET_KEY.{expiresIn,"10m"})
    res.json({message:"login realizado com sucesso",token})
})

//Executando o servidor 
app.listen(port, ()=>{
    console.log(`servidor rodando http://localhost:${port}`)
})

