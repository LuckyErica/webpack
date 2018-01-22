import css from './css/index.css'
import less from './css/black.less'
import sass from './css/red.scss'
{
    let jspangString = 'Hello Webpack1'
    // document.getElementById('title').innerHTML = jspangString;
    $('#title').html(jspangString)
}

var json =require('./db.json');
document.getElementById("json").innerHTML= json.name;

