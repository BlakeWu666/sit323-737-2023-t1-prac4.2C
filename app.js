const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs'); // fs is for file system, we gonna use it to store our token
const fakeLocal = require('./fakeLocal.json');
const bodyParser = require ('body-parser');
const path = require('path');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

app.set('views', path.join(__dirname,"views"));
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:false}));

passport.use(
    new localStrategy(async (username, password, done/*function call*/ ) =>{
        //return done(null,false, {message:'Users are not found..'}); This is a failed auth with an optional message.

        /*let myErr = new Error('Error..');
        return done(myErr); Print if there is an Err*/
        console.log('Still work')
        return done(null/*no err here*/ , {username:'Lidong Wu',id:'220344642'},{message:'You have successfully logged in.'/*Optional message*/ })//successful auth with the 2nd param is the user obj.

    })
)

app.get('/', (req,res)=>{
    res.send ('This is the homepage of the routes.');
})

app.get('/secureroute', async(req,res)=>{
    res.send('This is our secure route..')
})
app.get('/logout', async(req,res)=>{
    res.send('For logging out')
})
app.get('/login', async(req,res)=>{
    res.render('login')
})
app.get('/signup', async(req,res)=>{
    res.render('signup')
})
app.get('/failed', (req,res,next)=>{
    res.send(`failed${req.query?.message}`)
})
app.get('/success', (req,res,next)=>{
    res.send(`success${req.query?.message}`)
})
app.post('/login', async(req,res,next)=>{
    //res.send('login forms submitted!')
    passport.authenticate('local', async(error, user, info)=>{
        if(!user){
            res.redirect(`/failed?message=${info.message}`)
        }
        if(user){
            res.redirect(`/success?message=${info.message}`)// redirect to the route with the optional message
    
        }
    })(req,res,next)// function call of the auth
})
app.post('/signup', async(req,res,next)=>{
    res.send('Signup forms submitted!')
})
/*app.get('/createToken', async(req,res)=>{
    let student = {userName:'Lidong Wu', studentID:'220344642'};
    
    const myToken = jwt.sign({student:student}, 'TOP_SECRET_KEY');
    console.log('My token is: ' + myToken);
    await fs.writeFile( // Here, we stored the token into a json file with fileSystem.writeFile.
        'fakeLocal.json',
        JSON.stringify({Autorization : `Bearer ${myToken}`}),
        (err)=>{
            if(err) throw err;
            console.log('updated the fake localStorage in the fake browser');
        }
    )

    res.send ('You just made a token and stored it in the json file.Visit the profile and wrongSecret page now.');
})

app.get('/profile', async(req,res)=>{
    console.log('Authorization token: ', fakeLocal.Autorization);
    const result = await jwt.verify(
        fakeLocal.Autorization.substring(7),
        "TOP_SECRET_KEY"
    );

    result.message = "We were be able to decrypt the token because we have a valid secret in the app and the token. The users data is inside the token."

    console.log('Result: ', result);
    res.json(result);
    // Here we simplify the items in the previous object, leaving only our token and providing the correct secretKey

})

app.get('/wrongSecret', async(req,res)=>{
    try{
        await jwt.verify(
            fakeLocal.Autorization.substring(7),
            "INCORRECT_SECRET"
        );
        res.send('/profile');
    }catch(err){
        console.log('Erro: ', err);// we display the err when the secret key is incorrect.
        return res.status(400).send('Invalid secret..')
    }
 // Here if we provide a new instance with a wrong secret and send it to the profile route, the app will catch the err.
})*/

app.listen(3000, ()=>{
    console.log('Listening on port 3000..')
})