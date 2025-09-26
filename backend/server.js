const express = require("express")
const fs = require("fs") //file system
const path = require("path") //caminho do arquinho
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const port = 5001;
app.use(cors());
app.use(express.json());
 
//criar uma string para renovar a chave da autenticação
 
const SECRET_KEY = "12345678910";
 
//local onde esta o arquivo do banco de dados
 
const localDados = path.join(__dirname,'data/usuarios.json');
 
// função para ler os dados do arquivo
 
const consultarUsuarios=()=>{
    const data = fs.readFileSync(localDados, "utf-8");
    return JSON.parse(data);
}
 
//função para gravar dados no arquivo
 
const salvarUsuarios=(users)=>{
    fs.writeFileSync(localDados,JSON.stringify(users,null,2))
}
 
//rota para regristar o usuario
 
app.post("/register", async(req,res)=>{
    const {email,senha} = req.body;
 
    if(!email || !senha){
        return res.status(400).json({message:"Campos obrigatorios"})
    }
    const users = consultarUsuarios();
    if(users.find(user=>user.email == email)){
        return res.status(400).json({message: "Email já cadastrado no banco de dados"})
    }
 
    //criptografar a senha
    const hashSenha = await bcrypt.hash(senha,10)
    const novoUsuario = {id:Date.now(), email,senha:hashSenha};
    users.push(novoUsuario);
    salvarUsuarios(users);
    res.status(200).json({message: "Usuario registrado com sucesso"})
})
 
// ROTA DO LOGIN
 
app.post("/login", async (req,res)=>{
    const {email, senha}= req.body;
    const users = consultarUsuarios();
    const user = users.find(user=>user.email === email);
 
    if(!user){
        return res.status(400).json({message: "Usuário/senha Inválidos"})
    }
    const senhaValida= await bcrypt.compare(senha, user.senha);
    if(!senhaValida){
         return res.status(400).json({message: "Senha inválida"})
    }
    // AUTENTICAÇÃO DO JWT
    const token = jwt.sign({id:user.id,email:user.email},SECRET_KEY,{expiresIn:"10m"});
    res.json({message:"Login realizado com sucesso",token})
 
})
const autenticaToken= (req,res,next)=>{
    const auth=req.headers['authorization'];
    const token = auth && auth.split('')[1];
    if(token == null)return res.sendStatus(401);
    jwt.verify(token,SECRET_KEY,(erro, user)=>{
        if(erro)return res.sendStatus(403)
        req.user = user;
        notStrictEqual();
    })
}

//rota dashboard
app.get("/dashboard",autenticaToken,(req,res)=>{
    res.json({message:"acesso autoreizado, bem vindo", user:req.user})
})



//executando o servidor na porta definida
app.listen(port,()=>{
    console.log(`Servidor rodando https://localhost:${port}`)
})
 