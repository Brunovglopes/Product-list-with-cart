
let globalcards = [];
let shoppingCart = [];
let qnty = document.getElementById("qnty");
let idbtn
let quanty = 1
const mycart = document.querySelector(".mycart");
let selectfilter = null
let qnty_number = document.createTextNode(`  ${shoppingCart.length}  `);

function carregarcards() {

    //Verifica o tamanho ideal da imagem

    const larguraTela = window.innerWidth;
    let imagecard;
    let cardname = "";
    if (larguraTela < 767) {
        imagecard = 'mobile';
    } else if (larguraTela > 767 && larguraTela < 1025) {
        imagecard = 'tablet';
    } else if (larguraTela > 1024) {
        imagecard = 'desktop';
    }

    
    const card_caixa = document.getElementById("cards_comidas"); // cria o container onde ficarão os cards 
    
    card_caixa.innerHTML = "";   //limpa o html se caso tenha algo

    globalcards.forEach(card_unit => { 
    cardname = card_unit.name.replace(/\s+/g, '_')  // pega o nome especifico, coloca '_' para não dar erro
   
        if (card_unit.culinaria != selectfilter && selectfilter != null ) { //verifica se o filtro foi selecionado 
            return; // Pula para o próximo item se não corresponder
        }
        const imageurl = card_unit.image[imagecard];
        let cardDiv = document.createElement('div'); 
        cardDiv.classList.add('card_unico');
        cardDiv.classList.add(`${cardname}`);
        cardDiv.id = cardname
        
        cardDiv.innerHTML = ` 
            <img src=${imageurl}>
            <div class="Buttoncard ">
                <button onclick="addcart(event)" id="${cardname}">
                    <i class="fas fa-shopping-cart"></i>
                    <p> Add to Cart </p>
                </button>
            </div>
            <div class="text_card">
                <p class="card_categoria"> ${card_unit.category}</p>
                <p class="card_nome"> ${card_unit.name} </p>
                <p class="card_valor"> R$ ${card_unit.price} </p>
        `;
        
        card_caixa.appendChild(cardDiv);
    });

    
    qnty.appendChild(qnty_number);
    cartselecionado()
}

async function carregarJSON() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        globalcards = data.cards;
        carregarcards();
    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
    }
}

window.onload = carregarJSON;

function addcart(event) {
    
  
    const btnclick = event.target.closest('button'); 
    idbtn = btnclick.id ; // pega o id do button que foi clicado
    nameclass = idbtn.replace(/_/g,' ') // transforma o id no name para comparar a posição no array globalcards
    let posicaoitem = globalcards.findIndex(item => item.name == nameclass) //pega a posiçaõ 
    
    
    
    
    
    const  verificacao = shoppingCart.some( item => item.name == globalcards[posicaoitem].name)
 
    if (verificacao) {
    const index = shoppingCart.findIndex(item => item.name === nameclass)
      shoppingCart[index].quantidade+=1

      
    atualizarcart();
    cartselecionado();
    valortotal();
    
       return

   } else {
   quanty = 1
   shoppingCart.push({ ...globalcards[posicaoitem], idbtn, quantidade : quanty} ); 
    atualizarcart();
    cartselecionado(); 
    valortotal()
   }



  }


function atualizarcart() {
  let indexcart = 0
  mycart.innerHTML = "";
    shoppingCart.forEach(carts =>{
    
    let imagecarturl = carts.image.mobile;
    let cartdiv = document.createElement("div");
    cartdiv.classList.add("purchases");
    cartdiv.innerHTML = `
        <img src="${imagecarturl}">
        <div class="text_purchases">
            <p class="name"> ${carts.name}</p>
            <p class="quantidade_comida"> ${carts.quantidade} </p>
            <p class="valor"> R$ ${carts.price}</p>
              
        </div>
        <button onclick="removerItemDoCarrinho(this)" id="${indexcart}"><i class="fas fa-times deletecart"></i></button>
    `;
    indexcart ++
    mycart.appendChild(cartdiv); 
    atualizarnumero();
    
    })
    
  
}

function atualizarnumero() {
    let produto = 0
    if (qnty.hasChildNodes()) {
        shoppingCart.forEach(number_quantidade =>{
        produto += number_quantidade.quantidade            
        }

        )
        qnty.firstChild.nodeValue = `${produto}`;
    } else {
        let qnty_number = document.createTextNode(`${shoppingCart.length}`);
        qnty.appendChild(qnty_number);
    }

    if (shoppingCart.length > 0) {
        removebackgruod();
    }
    if (shoppingCart.length <= 0) {
        addbackgroud()
    }
}

function removebackgruod() {

    let backgrouimage = document.querySelector('.mycart');
    let textbefore = document.querySelector('.textbefore');
    if (backgrouimage.classList.contains('myhcartnull')) {
        backgrouimage.classList.remove('myhcartnull');
        textbefore.classList.remove('before');
        buttonfinalizarcompra()
    }
    
}
function addbackgroud(){
  let textbefore = document.querySelector('.textbefore');
  let backgrouimage = document.querySelector('.mycart');
    if (!backgrouimage.classList.contains('myhcartnull')) {
        backgrouimage.classList.add('myhcartnull');
        textbefore.classList.add('before');
        buttonfinalizarcompra()

}}

function removerItemDoCarrinho(button) {
    const buttonId = parseInt(button.id);
    const itemRemovido = shoppingCart[buttonId];
    if(shoppingCart[buttonId].quantidade > 1 ){
      shoppingCart[buttonId].quantidade-=1
      atualizarnumero();
      atualizarcart();
      valortotal();
        return
    }else{
    shoppingCart.splice(buttonId, 1);
    
    atualizarcart();
    atualizarnumero();
    cartselecionado_remove(itemRemovido)
    valortotal();
    }}
  function cartselecionado(){
    let itemselecionado
    let card_unico =''
    shoppingCart.forEach(itemnocarrinho =>{
        itemselecionado = itemnocarrinho.name.replace(/\s+/g, '_') 
        card_unico = document.querySelector(`.${itemselecionado}`);
       
        if (card_unico) {
            card_unico.classList.add("selecionada");
        } else {
          
        }
         
        
    })
  }
function cartselecionado_remove(itemRemovido){
    item = itemRemovido.name.replace(/\s+/g, '_'); 
    let card_unico = document.querySelector(`.${item}`);
    if (card_unico) {
      card_unico.classList.remove("selecionada");
    }
    else{
           console.warn(`Elemento não encontrado para:${item}`)
    }
    }

 function valortotal() {
    let totalunic = 0
    let total = 0
    shoppingCart.forEach(buy =>{
    totalunic = buy.price*buy.quantidade
    total += totalunic    
    }) 
    const valortotal = document.getElementById('valortotal');
    valortotal.innerHTML=`R$ ${total}`
    if (total == 0) {
        
         valortotal.innerHTML=""
         
        }
    
 }

  function finalizarcompra() {
      const resumo_tela = document.querySelector(".container");
      resumo_tela.innerHTML=''
      shoppingCart.forEach( item =>{
          let imagecarturl = item.image.mobile;
          let cartdiv = document.createElement("div");
          cartdiv.classList.add("purchases");
          cartdiv.innerHTML = `
              <img src="${imagecarturl}">
        <div class="text_purchases">
            <p class="name"> ${item.name}</p>
            <p class="quantidade_comida"> ${item.quantidade} </p>
            <p class="valor"> R$ ${item.price}</p>
              
        </div>
        `;    
      resumo_tela.appendChild(cartdiv)
                }
      )
      console.log(resumo_tela);
      
           }
 let buttonfilter = document.querySelectorAll(".filtro_culinaria")
  buttonfilter.forEach(buttontest=>{
    buttontest.addEventListener('click',()=>{
        selectfilter = buttontest.value
        carregarcards() 
        
    }
     
    )
  }
   
  )
 
        
function buttonfinalizarcompra(){

    let blocofinalizar = document.getElementById('finalizarcompra');
    if(shoppingCart.length > 0){
        blocofinalizar.style.display = "block"
    }else{
        blocofinalizar.style.display="none"
    }
}


// Verificação se é mobile ou 
const shoppingdiv = document.querySelector('.shopping_cart')
let widthmobile = false
window.addEventListener('resize',() => {
    if (window.innerWidth < 1003) {
        widthmobile = true
    }
    else {
        widthmobile = false
    }
 if (widthmobile && shoppingCart.length<1){
    shoppingdiv.style.display= 'none'
}
if (!widthmobile) {
    shoppingdiv.style.display= 'block' 
}
if (widthmobile && shoppingCart.length>0){
    shoppingdiv.style.display= 'flex'
}
// console.log(widthmobile);
}

)
// if( window.innerWidth < 1003){
    
//     shoppingdiv.style.display= 'none'}
  
// function shoppingcart_mobilenone(){
//     if( window.innerWidth < 1003){
    
//     shoppingdiv.style.display= 'none'}
// }   
// function shoppingcart_mobile(){
//     if(verificacao){
//         shoppingdiv.style.display= 'flex'
//     }else{

//     }
// }
// function shoppingcart_desktop(){
//     shoppingdiv.style.display= 'block'
// }