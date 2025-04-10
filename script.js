const input_file = document.querySelector("#file")

input_file.addEventListener("change", (e) => {
    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = (e) => {
        load_img(e.target.result)
    }
    
})


const cvs = document.getElementById( 'cvs' )
const cw = cvs.width
const ch = cvs.height
var out = document.getElementById( 'out' )

out.width = 900
out.height = 270

const times = out.width/300
const square = 80*times

const oh = square
const ow = square


let ix = 0    // 中心座標
let iy = 0
let v = 1.0   // 拡大縮小率
const img  = new Image()
img.onload = function( _ev ){   // 画像が読み込まれた
    ix = img.width  / 2
    iy = img.height / 2
    let scl = ( cw / img.width *100
     )
    document.getElementById( 'scal' ).value = scl
    scaling( scl )
}
function load_img( _url ){  // 画像の読み込み
    img.src = ( _url ? _url : "images/21471.png")
}
load_img() 

function scaling( _v ) {        // スライダーが変った
    v = parseInt( _v ) * 0.01
    draw_canvas( ix, iy )       // 画像更新
}

function draw_canvas( _x, _y ){     // 画像更新
    const ctx = cvs.getContext( '2d' )
    ctx.fillStyle = 'rgb(200, 200, 200)'
    ctx.fillRect( 0, 0, cw, ch )    // 背景を塗る
    ctx.drawImage( img,
        0, 0, img.width, img.height,
        (cw/2)-_x*v, (ch/2)-_y*v, img.width*v, img.height*v,
    )
    ctx.strokeStyle = 'rgba(200, 0, 0, 0.8)'
    ctx.strokeRect( (cw-ow)/2, (ch-oh)/2, ow, oh ) // 赤い枠
}
function crop_img(){                // 画像切り取り
    const ctx = out.getContext( '2d' )
    ctx.fillStyle = 'rgb(200, 200, 200)'
    ctx.fillRect( 5*times,5*times, ow, oh )    // 背景を塗る
    ctx.drawImage( img,
        0, 0, img.width, img.height,
        (ow/2)-ix*v+5*times, (oh/2)-iy*v+5*times, img.width*v, img.height*v,
    )
    load_status()
}




let mouse_down = false      // canvas ドラッグ中フラグ
let sx = 0                  // canvas ドラッグ開始位置
let sy = 0
cvs.ontouchstart =
cvs.onmousedown = function ( _ev ){     // canvas ドラッグ開始位置
    mouse_down = true
    sx = _ev.pageX
    sy = _ev.pageY
    return false // イベントを伝搬しない
}
cvs.ontouchend =
cvs.onmouseout =
cvs.onmouseup = function ( _ev ){       // canvas ドラッグ終了位置
    if ( mouse_down == false ) return
    mouse_down = false
    draw_canvas( ix += (sx-_ev.pageX)/v, iy += (sy-_ev.pageY)/v )
    return false // イベントを伝搬しない
}
cvs.ontouchmove =
cvs.onmousemove = function ( _ev ){     // canvas ドラッグ中
    if ( mouse_down == false ) return
    draw_canvas( ix + (sx-_ev.pageX)/v, iy + (sy-_ev.pageY)/v )
    return false // イベントを伝搬しない
}
cvs.onmousewheel = function ( _ev ){    // canvas ホイールで拡大縮小
    let scl = parseInt( parseInt(document.getElementById( 'scal' ).value ) + _ev.wheelDelta * 0.05 )
    if ( scl < 10  ) scl = 10
    if ( scl > 400 ) scl = 400
    document.getElementById( 'scal' ).value = scl
    scaling( scl )
    return false // イベントを伝搬しない
}

const flaglist = [
    ["empty", "movable", ""],
    ["damage", "movable", "攻"],
    ["defence", "movable", "+守"],
    ["hp", "movable", "+HP"],
    ["mp", "movable", "+MP"],
    ["free_text1", "movable", ""],
    ["free_text2", "movable", ""],
    ["free_text3", "movable", ""],
    ["double_attack", "fixed", "二回攻撃する"],
    ["deflect_normal", "fixed", "無属性武器を弾く"],
    ["deflect_magic", "fixed", "奇跡を弾く"],
    ["bounce_normal", "fixed", "無属性武器をはね返す"],
    ["bounce_magic", "fixed", "奇跡をはね返す"],
    ["stop_magic", "fixed", "奇跡を止める"],
    ["absorb_hp", "fixed", "HPを吸収する"],
    ["damage_cold", "fixed", "ダメージで風邪"],
    ["damage_hell", "fixed", "ダメージで地獄病"],
    ["damage_fog", "fixed", "ダメージで霧"],
    ["damage_flash", "fixed", "ダメージで閃光"],
    ["damage_darkcloud", "fixed", "ダメージで暗雲"],
    ["damage_dream", "fixed", "ダメージで夢"],
    ["dye_fire", "fixed", "火属性に染める"],
    ["dye_water", "fixed", "水属性に染める"],
    ["damage_user", "fixed", "使用者に同じダメージ"],
    ["free_magic", "fixed", "消費なしで奇跡を起こす"],
    ["all_mp", "fixed", "MPを全て消費する"],
    ["damage_someone", "fixed", "誰かに攻撃する"],
    ["reset_artifact", "fixed", "使用者に夢と神器一新"],
    ["user_fever", "fixed", "使用者に熱病"],
]


var flagnumber = 0
var sflagnumber = 0
var sflag2number = 0

var flag = "empty"
var sflag = "empty"
var sflag2 = "empty"
var mtext = "empty"
var stext = "empty"
var stext2 = "empty"

var moneymp = "money"

const c_null = "#555555"
const c_fire = "#ff6666"
const c_water = "#6666ff"
const c_wood = "#ff9900"
const c_ground = "#6688aa"
const c_light = "#c5c500"
const c_dark ="#aa55cc"
var text_color = "#555555"

const counts = [0,0,0,0,0,0,0,0]

var keepedcvs1 = out.toDataURL("image/png")
var keepedcvs2 = out.toDataURL("image/png")
var keepedcvs3 = out.toDataURL("image/png")
var keepedcvs4 = out.toDataURL("image/png")
var keepedcvs5 = out.toDataURL("image/png")
var keepedcvs6 = out.toDataURL("image/png")
var keepedcvs7 = out.toDataURL("image/png")
var keepedcvs8 = out.toDataURL("image/png")

//画像更新　画像以外
function load_status(){
    //change_cvs()
    const ctx = out.getContext('2d')
    ctx.fillStyle = 'rgb(85, 187, 153)'
    ctx.fillRect(0, 0, 5*times, out.height)
    ctx.fillRect(0, 0, out.width, 5*times)
    ctx.fillRect(5*times, 5*times+oh, out.width, 5*times)
    ctx.fillRect(5*times+square, 0, out.width-5*times-square, out.height)
    ctx.fillStyle = 'rgb(221, 255, 204)'
    ctx.fillRect(5*times*2+square, 5*times, 205*times, 32*times)
    ctx.fillRect(5*times*2+square, (5+33)*times, 205*times, 46*times)
    ctx.fillStyle = 'rgb(85, 187, 153)'
    ctx.fillRect(10*times+square+times, 5*times+times, 203*times, times)
    ctx.fillRect(10*times+square+times, 5*times+times+29*times, 203*times, times)
    ctx.fillRect(10*times+square+times, 5*times+times, times, 29*times)
    ctx.fillRect(10*times+square+times+202*times, 5*times+times, times, 29*times)

    to_circle("clear", 'rgb(85, 187, 153)', out.width, 0, 5*times, 1)
    to_circle("clear", 'rgb(85, 187, 153)', 0, 0, 5*times, 2)
    to_circle("clear", 'rgb(85, 187, 153)', 0, out.height, 5*times, 3)
    to_circle("clear", 'rgb(85, 187, 153)', out.width, out.height, 5*times, 4)

    name_load()
    element_load()

    if(document.querySelector("#format1").checked){
        flagsort()
        damage()
    }else if(document.querySelector("#format2").checked){
        double_freetext()
    }else if(document.querySelector("#format3").checked){
        quadruple_freetext()
    }

    money()

}
load_status()






//テキスト描画
//名前
function name_load(){
    const ctx = out.getContext('2d')
    const name_text = document.querySelector('#name').value
    ctx.fillStyle = text_color
    ctx.font = 'bold 60px "Noto Sans JP"'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'start'
    var starttextline = 0
    if(document.querySelector("#nameleft").checked){
        starttextline = -2*times
    }else{
        starttextline = 0
    }
    ctx.fillText(name_text, 10*times+square+5*times+starttextline, 5*times+15*times)
}

//属性画像
function element_load(){
    const ctx = out.getContext("2d")
    const img1 = new Image()

    if(text_color == c_fire){
        img1.src = "images/fire.png"
    }else if(text_color == c_water){
        img1.src = "images/water.png"
    }else if(text_color == c_wood){
        img1.src = "images/wood.png"
    }else if(text_color == c_ground){
        img1.src = "images/stone.png"
    }else if(text_color == c_light){
        img1.src = "images/light.png"
    }else if(text_color == c_dark){
        img1.src = "images/darkness.png"
    }

    img1.onload = (e) =>{
        ctx.drawImage(img1, 13*times+square, 41*times, 20*times, 20*times)
    }
}


//属性の変更
function change_color_null(){
    text_color = c_null
    load_status()
}
function change_color_fire(){
    text_color = c_fire
    load_status()
}
function change_color_water(){
    text_color = c_water
    load_status()
}
function change_color_wood(){
    text_color = c_wood
    load_status()
}
function change_color_ground(){
    text_color = c_ground
    load_status()
}
function change_color_light(){
    text_color = c_light
    load_status()
}
function change_color_dark(){
    text_color = c_dark
    load_status()
}

//テキストボックス　数字のみ
function validateNumberInput(input) {
    input.value = input.value.replace(/[^0-9]/g, "")
}

//メインテキスト表示
function main_text(text){
    mtext = text
    const ctx = out.getContext('2d')
    ctx.fillStyle = text_color
    ctx.font = 'bold 57px "Noto Sans JP"'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'start'
    ctx.fillText(text, 10*times+square+5*times+5*times+19*times, 38*times+12*times)
}

//サブテキスト表示
function sub_text(text){
    stext = text
    s_reset()
    const ctx = out.getContext('2d')
    ctx.fillStyle = text_color
    ctx.font = '40px "Noto Sans JP"'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'start'
    ctx.fillText(text, 10*times+square+4*times, 38*times+12*times+24*times)
}

//サブサブテキスト表示
function sub_text2(text){
    const ctx = out.getContext('2d')
    s_reset()
    stext2 = text
    ctx.fillStyle = text_color
    ctx.font = '30px "Noto Sans JP"'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'start'
    ctx.fillText(stext, 10*times+square+3*times, 38*times+6*times+23*times)
    ctx.fillText(text, 10*times+square+3*times, 38*times+6*times+23*times+11*times)
}

//サブテキストリセット
function s_reset(){
    const ctx = out.getContext('2d')
    ctx.fillStyle = 'rgb(221, 255, 204)'
    ctx.fillRect(5*times*2+square, (5+33+23)*times, 205*times, 23*times)
}


//flagsort用
function checkemptyflag(i, flagvalue){
    if(flaglist[i][1] == "movable"){
        if(!document.querySelector(`#${flaglist[i][0]}`).value){
            return [0, "empty"]
        }else{
            return [i, flagvalue]
        }
    }else if(!document.querySelector(`#${flaglist[i][0]}`).checked){
        return [0, "empty"]
    }else{
        return [i, flagvalue]
    }
}

//flagsort()用
function assign_flag(i){
    if(flag == "empty" && flaglist[i][1] == "movable"){
        flag = flaglist[i][0]
        flagnumber = i
    }else if(sflag == "empty"){
        sflag = flaglist[i][0]
        sflagnumber = i
    }else if(sflag2 == "empty"){
        sflag2 = flaglist[i][0]
        sflag2number = i
    }
}

//flag管理
function flagsort(){
    for(let i=1;i<flaglist.length;i++){
        if(flaglist[i][0] == flag){
            flagnumber = checkemptyflag(i, flag)[0]
            flag = checkemptyflag(i, flag)[1]
        }else if(flaglist[i][0] == sflag){
            sflagnumber = checkemptyflag(i, sflag)[0]
            sflag = checkemptyflag(i, sflag)[1]
        }else if(flaglist[i][0] == sflag2){
            sflag2number = checkemptyflag(i, sflag2)[0]
            sflag2 = checkemptyflag(i, sflag2)[1]
        }
    }
    if(flagnumber == 0){//flag == ""
        if(flaglist[sflagnumber][1] == "movable"){//flagの繰り上がり
            flag = sflag
            flagnumber = sflagnumber
            sflag = sflag2
            sflagnumber = sflag2number
            sflag2 = "empty"
            sflag2number = 0
            if(flagnumber == 0 && flaglist[sflagnumber][1] == "movable"){//flag == "empty"
                flag = sflag
                flagnumber = sflagnumber
                sflag = "empty"
                sflagnumber = 0
            }
        }else if(flaglist[sflag2number][1] == "movable"){
            flag = sflag2
            flagnumber = sflag2number
            sflag2 = "empty"
            sflag2number = 0
        }
    }else if(sflagnumber == 0){
        sflag = sflag2
        sflagnumber = sflag2number
        sflag2 = "empty"
        sflag2number = 0
    }


    for(i = 1;i<flaglist.length;i++){
        if(flagnumber != i && sflagnumber != i && sflag2number != i){
            if(flaglist[i][1] == "movable"){
                if(document.querySelector(`#${flaglist[i][0]}`).value){
                    assign_flag(i)
                }
            }else if(document.querySelector(`#${flaglist[i][0]}`).checked){
                assign_flag(i)
            }
        }
    }
}



function realvalue(thisflagnumber){
    if(flaglist[thisflagnumber][0] == "damage"){
        if(document.querySelector("#damageplus").checked){
            if(document.querySelector("#percent").value){
                return document.querySelector("#percent").value + "%" + "+" + flaglist[thisflagnumber][2] + document.querySelector(`#${flaglist[thisflagnumber][0]}`).value
            }else{
                return "+" + flaglist[thisflagnumber][2] + document.querySelector(`#${flaglist[thisflagnumber][0]}`).value
            }
        }else if(document.querySelector("#percent").value){
            return document.querySelector("#percent").value + "%" + flaglist[thisflagnumber][2] + document.querySelector(`#${flaglist[thisflagnumber][0]}`).value
        }else{
            return flaglist[thisflagnumber][2] + document.querySelector(`#${flaglist[thisflagnumber][0]}`).value
        }
    }else if(thisflagnumber == 0){
        return ""
    }else if(flaglist[thisflagnumber][1] == "movable"){
        return flaglist[thisflagnumber][2] + document.querySelector(`#${flaglist[thisflagnumber][0]}`).value
    }else{
        return flaglist[thisflagnumber][2]
    }
}

function damage(){
    if(flag != "empty"){
        main_text(realvalue(flagnumber))
    }
    if(sflag != "empty"){
        if(!layerF){
            sub_text(realvalue(sflagnumber))
        }else{
            stext = realvalue(sflagnumber)
            sub_text2(realvalue(sflag2number))
        }
    }
}




function double_freetext(){
    const ctx = out.getContext('2d')
    ctx.fillStyle = text_color
    ctx.font = '47px "Noto Sans JP"'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'start'
    ctx.fillText(document.querySelector("#free_text11").value, 10*times+square+4*times, 38*times+12*times)
    ctx.fillText(document.querySelector("#free_text12").value, 10*times+square+4*times, 38*times+12*times+20*times)
}

function quadruple_freetext(){
    const ctx = out.getContext('2d')
    ctx.fillStyle = text_color
    ctx.font = '32px "Noto Sans JP"'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'start'
    ctx.fillText(document.querySelector("#free_text21").value, 10*times+square+3*times, 38*times+6*times+times)
    ctx.fillText(document.querySelector("#free_text22").value, 10*times+square+3*times, 38*times+6*times+12*times)
    ctx.fillText(document.querySelector("#free_text23").value, 10*times+square+3*times, 38*times+6*times+23*times)
    ctx.fillText(document.querySelector("#free_text24").value, 10*times+square+3*times, 38*times+6*times+23*times+11*times)
}


function money(){
    const Money = document.querySelector("#money")
    const Mp_needed = document.querySelector("#mp_needed")
    if(Money.value && !Mp_needed.value){
        moneymp = "money"
    }else if(!Money.value && Mp_needed.value){
        moneymp = "mp"
    }

    const ctx = out.getContext('2d')

    if(moneymp == "money"){
        ctx.fillStyle = "rgb(255, 255, 170)"
        ctx.strokeStyle = "rgb(221, 221, 136)"
        ctx.lineWidth = 3

        ctx.beginPath()
        ctx.arc(out.width-5*times-23*times, out.height-5*times-24*times, 21*times, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = c_null
        ctx.strokeStyle = c_null
        ctx.font = '300 50px "Noto Sans JP"'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        if(document.querySelector("#money").value){
            ctx.lineWidth = 1.5
            ctx.strokeText("¥" + document.querySelector("#money").value, out.width-5*times-23*times, out.height-5*times-24*times)
            ctx.fillText("¥" + document.querySelector("#money").value, out.width-5*times-23*times, out.height-5*times-24*times)
        }

    }else if(moneymp == "mp"){
        ctx.fillStyle = "rgb(119, 119, 255)"
        const upperleft_x = out.width-7*times-49*times
        const upperleft_y = out.height-7*times-43*times
        ctx.fillRect(upperleft_x, upperleft_y, 49*times, 42*times)

        to_circle("rgb(221, 255, 204)", "rgb(119, 119, 255)", upperleft_x+49*times, upperleft_y, 5*times, 1)
        to_circle("rgb(221, 255, 204)", "rgb(119, 119, 255)", upperleft_x, upperleft_y, 5*times, 2)
        to_circle("rgb(221, 255, 204)", "rgb(119, 119, 255)", upperleft_x, upperleft_y+42*times, 5*times, 3)
        to_circle("rgb(221, 255, 204)", "rgb(119, 119, 255)", upperleft_x+49*times, upperleft_y+42*times, 5*times, 4)

        ctx.fillStyle = "#ffffff"
        ctx.font = '100 48px "Noto Sans JP"'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillText("消費", upperleft_x+25*times, upperleft_y+12*times)
        if(document.querySelector("#mp_needed").value){
            ctx.fillText("MP" + document.querySelector("#mp_needed").value, upperleft_x+25*times, upperleft_y+31*times)
        }
    }
}


//2段化
var layerF = false
var keep_text3 = ""
document.querySelector("#free_text3").style.visibility = "hidden"


function layer_flag(){
    const parent = document.querySelector("#free_text2")
    if(!layerF && document.querySelector("#double_layer").checked){
        layerF = true
        document.querySelector("#free_text3").value = keep_text3
        document.querySelector("#free_text3").style.visibility = "visible"
    }else if(layerF && !document.querySelector("#double_layer").checked){
        layerF = false
        keep_text3 = document.querySelector("#free_text3").value
        document.querySelector("#free_text3").value = ""
        document.querySelector("#free_text3").style.visibility = "hidden"
    }
    load_status()
}


//フォーマット切り替え
function change_format(){
    for(i=1;i<4;i++){
        const formats = document.querySelector(`#format${i}`)
        const models = document.querySelector(`#model${i}`)
        if(formats.checked){
            models.classList.remove("hidden")
        }else if(!formats.checked){
            models.classList.add("hidden")
            
            models.querySelectorAll("input").forEach(input => {
                if(input.type == "text" || input.type == "number"){
                    input.value = ""
                }else if(input.id == "double_layer" && input.checked){
                    input.checked = false
                    layer_flag()
                }else if(input.type == "radio" || input.type == "checkbox"){
                    input.checked = false
                }
            })
        }
    }

    load_status()
}


//角を丸くする
function to_circle(back, front, x, y, r, quadrant){
    const ctx = out.getContext('2d')
    if(back != "clear"){
        ctx.fillStyle = back
    }

    function fillorclear(backname, startx, starty, longx, longy){
        if(backname == "clear"){
            ctx.clearRect(startx, starty, longx, longy)
        }else{
            ctx.fillRect(startx, starty, longx, longy)
        }
    }

    if(quadrant == 1){
        fillorclear(back, x-r, y, r, r)
        ctx.fillStyle = front
        ctx.beginPath()
        ctx.moveTo(x-r, y+r)
        ctx.arc(x-r, y+r, r, -1*Math.PI/2, 0)
        ctx.closePath()
        ctx.fill()
    }else if(quadrant == 2){
        fillorclear(back, x, y, r, r)
        ctx.fillStyle = front
        ctx.beginPath()
        ctx.moveTo(x+r, y+r)
        ctx.arc(x+r, y+r, r, -1*Math.PI, -1*Math.PI/2)
        ctx.closePath()
        ctx.fill()
    }else if(quadrant == 3){
        fillorclear(back, x, y-r, r, r)
        ctx.fillStyle = front
        ctx.beginPath()
        ctx.moveTo(x+r, y-r)
        ctx.arc(x+r, y-r, r, Math.PI/2, Math.PI)
        ctx.closePath()
        ctx.fill()
    }else if(quadrant == 4){
        fillorclear(back, x-r, y-r, r, r)
        ctx.fillStyle = front
        ctx.beginPath()
        ctx.moveTo(x-r, y-r)
        ctx.arc(x-r, y-r, r, 0, Math.PI/2)
        ctx.closePath()
        ctx.fill()
    }
}


/*function change_cvs(){
    for(i=1;i<9;i++){
        if(document.querySelector(`#cvs${i}`).checked){
            document.getElementsByName(`out${i}`)[0].classList.remove("hidden")
            document.getElementsByName(`out${i}`)[0].id = "out"
        }else{
            document.getElementsByName(`out${i}`)[0].classList.add("hidden")
            document.getElementsByName(`out${i}`)[0].id = ""
        }
    }
    out = document.querySelector("#out")
    if(out.width != 900){
        out.width = 900
    }
    if(out.height != 270){
        out.height = 270
    }
}*/

//pdf作成
async function generatepdf(){
    const pdf = await new window.jspdf.jsPDF("l", "pt", "a4", )
    //const imageData = out.toDataURL("image/png")
    pdf.addImage(keepedcvs1, "PNG", 15, 25, 390, 117)
    pdf.addImage(keepedcvs2, "PNG", 435, 25, 390, 117)
    pdf.addImage(keepedcvs3, "PNG", 15, 167, 390, 117)
    pdf.addImage(keepedcvs4, "PNG", 435, 167, 390, 117)
    pdf.addImage(keepedcvs5, "PNG", 15, 309, 390, 117)
    pdf.addImage(keepedcvs6, "PNG", 435, 309, 390, 117)
    pdf.addImage(keepedcvs7, "PNG", 15, 454, 390, 117)
    pdf.addImage(keepedcvs8, "PNG", 435, 454, 390, 117)

    pdf.save("gfgenerater")
}

//警告ダイアログ表示



//canvas保存
function keepcvs1(){
    counts[0] += 1
    if(counts[0]>2){
        const oldimg = document.createElement("img")
        const newimg = document.createElement("img")
        oldimg.width = out.width/3
        oldimg.height = out.height/3
        newimg.width = out.width/3
        newimg.height = out.height/3
        oldimg.src = keepedcvs1
        oldimg.alt = "oldpreview"
        document.querySelector("#dialog_p").appendChild(oldimg)
        document.querySelector("#dialog_q").appendChild(newimg)

        const dialog = document.querySelector("#warning")
        const confirm_func= () => {
            counts[0] = 1
            dialog.close()
            keepcvs1()
        }

        const cancel_func = () => {
            dialog.close()
        }

        const close_func = () => {
            oldimg.remove()
            newimg.remove()
            document.querySelector("#confirm").removeEventListener("click", confirm_func)
            document.querySelector("#cancel").removeEventListener("click", cancel_func)
            dialog.removeEventListener("close", close_func)
        }

        document.querySelector("#confirm").addEventListener("click", confirm_func)
        document.querySelector("#cancel").addEventListener("click", cancel_func)
        dialog.addEventListener("close", close_func)

        newimg.alt = "newpreview"
        newimg.onload = () =>{
            dialog.showModal()
        }
        newimg.src = out.toDataURL("image/png")

    }else{
        keepedcvs1 = out.toDataURL("image/png")
        const keepedImage = new Image()
        keepedImage.onload = (e) =>{
            const ctx = document.querySelector("#examplecvs").getContext("2d")
            ctx.drawImage(keepedImage, 10, 10, 150, 45)
        }
        keepedImage.src = keepedcvs1
    }
}
function keepcvs2(){
    counts[1] += 1
    if(counts[1]>2){
        const oldimg = document.createElement("img")
        const newimg = document.createElement("img")
        oldimg.width = out.width/3
        oldimg.height = out.height/3
        newimg.width = out.width/3
        newimg.height = out.height/3
        oldimg.src = keepedcvs2
        oldimg.alt = "oldpreview"
        document.querySelector("#dialog_p").appendChild(oldimg)
        document.querySelector("#dialog_q").appendChild(newimg)

        const dialog = document.querySelector("#warning")
        const confirm_func= () => {
            counts[1] = 1
            dialog.close()
            keepcvs2()
        }

        const cancel_func = () => {
            dialog.close()
        }

        const close_func = () => {
            oldimg.remove()
            newimg.remove()
            document.querySelector("#confirm").removeEventListener("click", confirm_func)
            document.querySelector("#cancel").removeEventListener("click", cancel_func)
            dialog.removeEventListener("close", close_func)
        }

        document.querySelector("#confirm").addEventListener("click", confirm_func)
        document.querySelector("#cancel").addEventListener("click", cancel_func)
        dialog.addEventListener("close", close_func)

        newimg.alt = "newpreview"
        newimg.onload = () =>{
            dialog.showModal()
        }
        newimg.src = out.toDataURL("image/png")

    }else{
        keepedcvs2 = out.toDataURL("image/png")
        const keepedImage = new Image()
        keepedImage.onload = (e) =>{
            const ctx = document.querySelector("#examplecvs").getContext("2d")
            ctx.drawImage(keepedImage, 170, 10, 150, 45)
        }
        keepedImage.src = keepedcvs2
    }
}
function keepcvs3(){
    counts[2] += 1
    if(counts[2]>2){
        const oldimg = document.createElement("img")
        const newimg = document.createElement("img")
        oldimg.width = out.width/3
        oldimg.height = out.height/3
        newimg.width = out.width/3
        newimg.height = out.height/3
        oldimg.src = keepedcvs3
        oldimg.alt = "oldpreview"
        document.querySelector("#dialog_p").appendChild(oldimg)
        document.querySelector("#dialog_q").appendChild(newimg)

        const dialog = document.querySelector("#warning")
        const confirm_func= () => {
            counts[2] = 1
            dialog.close()
            keepcvs3()
        }

        const cancel_func = () => {
            dialog.close()
        }

        const close_func = () => {
            oldimg.remove()
            newimg.remove()
            document.querySelector("#confirm").removeEventListener("click", confirm_func)
            document.querySelector("#cancel").removeEventListener("click", cancel_func)
            dialog.removeEventListener("close", close_func)
        }

        document.querySelector("#confirm").addEventListener("click", confirm_func)
        document.querySelector("#cancel").addEventListener("click", cancel_func)
        dialog.addEventListener("close", close_func)

        newimg.alt = "newpreview"
        newimg.onload = () =>{
            dialog.showModal()
        }
        newimg.src = out.toDataURL("image/png")

    }else{
        keepedcvs3 = out.toDataURL("image/png")
        const keepedImage = new Image()
        keepedImage.onload = (e) =>{
            const ctx = document.querySelector("#examplecvs").getContext("2d")
            ctx.drawImage(keepedImage, 10, 65, 150, 45)
        }
        keepedImage.src = keepedcvs3
    }
}
function keepcvs4(){
    counts[3] += 1
    if(counts[3]>2){
        const oldimg = document.createElement("img")
        const newimg = document.createElement("img")
        oldimg.width = out.width/3
        oldimg.height = out.height/3
        newimg.width = out.width/3
        newimg.height = out.height/3
        oldimg.src = keepedcvs4
        oldimg.alt = "oldpreview"
        document.querySelector("#dialog_p").appendChild(oldimg)
        document.querySelector("#dialog_q").appendChild(newimg)

        const dialog = document.querySelector("#warning")
        const confirm_func= () => {
            counts[3] = 1
            dialog.close()
            keepcvs4()
        }

        const cancel_func = () => {
            dialog.close()
        }

        const close_func = () => {
            oldimg.remove()
            newimg.remove()
            document.querySelector("#confirm").removeEventListener("click", confirm_func)
            document.querySelector("#cancel").removeEventListener("click", cancel_func)
            dialog.removeEventListener("close", close_func)
        }

        document.querySelector("#confirm").addEventListener("click", confirm_func)
        document.querySelector("#cancel").addEventListener("click", cancel_func)
        dialog.addEventListener("close", close_func)

        newimg.alt = "newpreview"
        newimg.onload = () =>{
            dialog.showModal()
        }
        newimg.src = out.toDataURL("image/png")

    }else{
        keepedcvs4 = out.toDataURL("image/png")
        const keepedImage = new Image()
        keepedImage.onload = (e) =>{
            const ctx = document.querySelector("#examplecvs").getContext("2d")
            ctx.drawImage(keepedImage, 170, 65, 150, 45)
        }
        keepedImage.src = keepedcvs4
    }
}
function keepcvs5(){
    counts[4] += 1
    if(counts[4]>2){
        const oldimg = document.createElement("img")
        const newimg = document.createElement("img")
        oldimg.width = out.width/3
        oldimg.height = out.height/3
        newimg.width = out.width/3
        newimg.height = out.height/3
        oldimg.src = keepedcvs5
        oldimg.alt = "oldpreview"
        document.querySelector("#dialog_p").appendChild(oldimg)
        document.querySelector("#dialog_q").appendChild(newimg)

        const dialog = document.querySelector("#warning")
        const confirm_func= () => {
            counts[4] = 1
            dialog.close()
            keepcvs5()
        }

        const cancel_func = () => {
            dialog.close()
        }

        const close_func = () => {
            oldimg.remove()
            newimg.remove()
            document.querySelector("#confirm").removeEventListener("click", confirm_func)
            document.querySelector("#cancel").removeEventListener("click", cancel_func)
            dialog.removeEventListener("close", close_func)
        }

        document.querySelector("#confirm").addEventListener("click", confirm_func)
        document.querySelector("#cancel").addEventListener("click", cancel_func)
        dialog.addEventListener("close", close_func)

        newimg.alt = "newpreview"
        newimg.onload = () =>{
            dialog.showModal()
        }
        newimg.src = out.toDataURL("image/png")

    }else{
        keepedcvs5 = out.toDataURL("image/png")
        const keepedImage = new Image()
        keepedImage.onload = (e) =>{
            const ctx = document.querySelector("#examplecvs").getContext("2d")
            ctx.drawImage(keepedImage, 10, 120, 150, 45)
        }
        keepedImage.src = keepedcvs5
    }
}
function keepcvs6(){
    counts[5] += 1
    if(counts[5]>2){
        const oldimg = document.createElement("img")
        const newimg = document.createElement("img")
        oldimg.width = out.width/3
        oldimg.height = out.height/3
        newimg.width = out.width/3
        newimg.height = out.height/3
        oldimg.src = keepedcvs6
        oldimg.alt = "oldpreview"
        document.querySelector("#dialog_p").appendChild(oldimg)
        document.querySelector("#dialog_q").appendChild(newimg)

        const dialog = document.querySelector("#warning")
        const confirm_func= () => {
            counts[5] = 1
            dialog.close()
            keepcvs6()
        }

        const cancel_func = () => {
            dialog.close()
        }

        const close_func = () => {
            oldimg.remove()
            newimg.remove()
            document.querySelector("#confirm").removeEventListener("click", confirm_func)
            document.querySelector("#cancel").removeEventListener("click", cancel_func)
            dialog.removeEventListener("close", close_func)
        }

        document.querySelector("#confirm").addEventListener("click", confirm_func)
        document.querySelector("#cancel").addEventListener("click", cancel_func)
        dialog.addEventListener("close", close_func)

        newimg.alt = "newpreview"
        newimg.onload = () =>{
            dialog.showModal()
        }
        newimg.src = out.toDataURL("image/png")

    }else{
        keepedcvs6 = out.toDataURL("image/png")
        const keepedImage = new Image()
        keepedImage.onload = (e) =>{
            const ctx = document.querySelector("#examplecvs").getContext("2d")
            ctx.drawImage(keepedImage, 170, 120, 150, 45)
        }
        keepedImage.src = keepedcvs6
    }
}
function keepcvs7(){
    counts[6] += 1
    if(counts[6]>2){
        const oldimg = document.createElement("img")
        const newimg = document.createElement("img")
        oldimg.width = out.width/3
        oldimg.height = out.height/3
        newimg.width = out.width/3
        newimg.height = out.height/3
        oldimg.src = keepedcvs7
        oldimg.alt = "oldpreview"
        document.querySelector("#dialog_p").appendChild(oldimg)
        document.querySelector("#dialog_q").appendChild(newimg)

        const dialog = document.querySelector("#warning")
        const confirm_func= () => {
            counts[6] = 1
            dialog.close()
            keepcvs7()
        }

        const cancel_func = () => {
            dialog.close()
        }

        const close_func = () => {
            oldimg.remove()
            newimg.remove()
            document.querySelector("#confirm").removeEventListener("click", confirm_func)
            document.querySelector("#cancel").removeEventListener("click", cancel_func)
            dialog.removeEventListener("close", close_func)
        }

        document.querySelector("#confirm").addEventListener("click", confirm_func)
        document.querySelector("#cancel").addEventListener("click", cancel_func)
        dialog.addEventListener("close", close_func)

        newimg.alt = "newpreview"
        newimg.onload = () =>{
            dialog.showModal()
        }
        newimg.src = out.toDataURL("image/png")

    }else{
        keepedcvs7 = out.toDataURL("image/png")
        const keepedImage = new Image()
        keepedImage.onload = (e) =>{
            const ctx = document.querySelector("#examplecvs").getContext("2d")
            ctx.drawImage(keepedImage, 10, 175, 150, 45)
        }
        keepedImage.src = keepedcvs7
    }
}
function keepcvs8(){
    counts[7] += 1
    if(counts[7]>2){
        const oldimg = document.createElement("img")
        const newimg = document.createElement("img")
        oldimg.width = out.width/3
        oldimg.height = out.height/3
        newimg.width = out.width/3
        newimg.height = out.height/3
        oldimg.src = keepedcvs8
        oldimg.alt = "oldpreview"
        document.querySelector("#dialog_p").appendChild(oldimg)
        document.querySelector("#dialog_q").appendChild(newimg)

        const dialog = document.querySelector("#warning")
        const confirm_func= () => {
            counts[7] = 1
            dialog.close()
            keepcvs8()
        }

        const cancel_func = () => {
            dialog.close()
        }

        const close_func = () => {
            oldimg.remove()
            newimg.remove()
            document.querySelector("#confirm").removeEventListener("click", confirm_func)
            document.querySelector("#cancel").removeEventListener("click", cancel_func)
            dialog.removeEventListener("close", close_func)
        }

        document.querySelector("#confirm").addEventListener("click", confirm_func)
        document.querySelector("#cancel").addEventListener("click", cancel_func)
        dialog.addEventListener("close", close_func)

        newimg.alt = "newpreview"
        newimg.onload = () =>{
            dialog.showModal()
        }
        newimg.src = out.toDataURL("image/png")

    }else{
        keepedcvs8 = out.toDataURL("image/png")
        const keepedImage = new Image()
        keepedImage.onload = (e) =>{
            const ctx = document.querySelector("#examplecvs").getContext("2d")
            ctx.drawImage(keepedImage, 170, 175, 150, 45)
        }
        keepedImage.src = keepedcvs8
    }
}

keepcvs1()
keepcvs2()
keepcvs3()
keepcvs4()
keepcvs5()
keepcvs6()
keepcvs7()
keepcvs8()
