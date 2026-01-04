const express=require("express")
const app= express()
const path= require("path")
const fs=require("fs")
const PORT=3000

const cookieParser=require("cookie-parser")
const session=require("express-session")



//conofiguraciones

app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser())

app.use("/data", express.static(path.join(__dirname, "data")));


//configuracion para las sesiones

app.use(session({
    secret:"1234", //contraseña
    resave:false, //guardar la sesion
    saveUninitialized:false, //no crea sesion hasta que tenga datos
    cookie: { maxAge: 1000 * 60 * 60 } //tiempo de la cookie

}))

app.get("/form", (req,res)=>{

    //lo que tiene que mostrar cuando se abre el formulario

    res.render("form",{
        nombre:"",
        email:"",
        edad:"",
        ciudad:"",
        intereses:[],
        errores: [],

    })
})  

//aqui viajan los datos guardados en el formulario

app.post("/form", (req, res)=>{

    const nombre=req.body.nombre
    const email=req.body.email
    const edad=req.body.edad
    const ciudad=req.body.ciudad

    let intereses=req.body.intereses || []
    if(!Array.isArray(intereses)){
            intereses=[intereses]
    }



//Array para mensajes de error

let errores=[]

//el nombre debe de tener mas de 3 caracteres

if(!nombre || nombre.length<3){
    errores.push("El nombre tiene que tener minimo tres caracteres")
}

//el correo electronico debe de tener mas de 2 caracteres

if(!email || email.length<2 ){
    errores.push("El email debe de tener mas de 2 caracteres")
}

//edad tiene que ser mayor a 0

if(!edad || edad<0){
    errores.push("La edad debe de ser mayor a 0")
}

//la ciudad debe de ser obligatoria

if(!ciudad){
    errores.push("El campo ciudad debe de estar relleno")
}

if(!intereses || (Array.isArray(intereses)&& intereses.length===0)){
    errores.push("Debe seleccionar al menos un interes")
}



if(errores.length){
    return res
    .status(400)
    .render("form",{nombre,email,edad,ciudad,intereses,errores})
}

//si no hay errores lo guradamos en json

//creamos la ruta del archivo
const filePath= path.join(__dirname, "data", "usuarios.json")

//leer el archivo
let baseDatosUsuarios = [];
if (fs.existsSync(filePath)) {
    baseDatosUsuarios = JSON.parse(fs.readFileSync(filePath, "utf8"));
}
//crear usuario
const nuevoUsuario={
    nombre,
    email,
    edad,
    ciudad,
    intereses
}
//añado a la base de datos
baseDatosUsuarios.push(nuevoUsuario)

//guardo en la base de datos

  //fs.writeFileSync-- escribe, Archivo, de forma sincronica
  //filePath--Ruta del archivo
  //json.stringify-- lo convierte a texto JSON objetos
  //null-- no queremos aplicar transformaciones extras
  //2-- es el tabulador

  fs.writeFileSync(filePath,JSON.stringify(baseDatosUsuarios, null,2))

  res.send("Usuario guardado correctamente")

})

//mostramos registro para registrarnos

app.get("/login", (req, res) => {
    res.render("login");
});

//procesa los datos y crea la sesion

app.post("/login",(req,res)=>{
    
    const email=req.body.email
    const password=req.body.password

    if(email && password==="1234"){
        req.session.user={
            email:email
        }

        console.log("SESION CREADA:", req.session.user); 

        return res.redirect("/profile")
    }

    res.render("login", {error: "Email o contraseña incorrectos"})
    
})

app.get("/profile", requiereLogin, (req,res) =>{
    
    res.render("profile",{
        user:req.session.user
    })
})

function requiereLogin(req,res,next){
    if(!req.session.user){
        return res.redirect("/login")
    }

    next()
}

app.post("/logout", (req,res)=>{
    req.session.destroy(error=>{
        if(error){
            return res.send("Error al cerrar sesion")
        }
        res.redirect("/login")
    })
})

app.get("/preferencias", (req,res)=>{

    const tema=req.cookies.tema || "claro"

    res.cookie("tema", tema,{maxAge:1000*60*60*24*7})

     res.render("preferencias", { tema }); 
})

app.post("/preferencias", (req,res)=>{
    const tema = req.body.tema || "claro";

    // Guardamos la cookie
    res.cookie("tema", tema, { maxAge: 1000*60*60*24*7 });

    // Redirigimos de nuevo a la página
    res.redirect("/preferencias");
});
    























app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en: http://localhost:${PORT}`)
})