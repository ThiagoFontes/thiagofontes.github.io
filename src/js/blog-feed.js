var xmlhttp = new XMLHttpRequest();

//Url with the Json
var url = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@medium/";

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myJson = JSON.parse(this.responseText);
    createCarousel(myJson);
  }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();

function getImage( str ) {
  //Regular expression to find image source attribute
  var regex = /<img.*?src=['"](.*?)['"]/;
  try {
    return regex.exec(str.substr(0,1200))[1];
  } catch(err) {
    return 'img/image.jpg';
  }
}

function createCarousel(myJson) {
  var out = "";
  var i;
  
  for(i = 0; i < 6; i++) {
    //Create div item
    var item = document.createElement('div');
    item.className = 'box-border left-up-notch';
    //.box-border.left-up-notch(style="background:white")
    //  .blog-item.left-up-notch
    var container = document.createElement('div');
    container.className = 'left-up-notch blog-item';
    container.type = 'button';
    container.action = myJson.items[i].link;
    
    //Create image if there's a image
    var postImg = document.createElement('img');
    if(getImage( myJson.items[i].description ) !== -1) {
      postImg.src = getImage( myJson.items[i].description );
      postImg.classList.add('itemImg');
    }
    
    
    //Create Title
    var title = document.createElement('h2');
    title.className = 'item-title';
    title.appendChild(document.createTextNode( myJson.items[i].title));
    var description = document.createElement('p');
    description.appendChild(document.createTextNode( myJson.items[i].description));
    
    var texts = document.createElement('div');
    texts.classList.add('texts')
    texts.appendChild(title);
    texts.insertAdjacentHTML( 'beforeend', myJson.items[i].description.replace(/<figure>.*?<\/figure>/g,"").substring(0,100)+'...' );
    texts.className = 'texts';
    //inserting elements into item
    container.appendChild(postImg);
    container.appendChild(texts);
    item.appendChild(container);
    // var a = document.createElement('a');
    // a.href = myJson.items[i].link;
    // a.target = '_BLANK'
    // a.appendChild(item);
    out += item.outerHTML;
  }
  
  document.getElementById("blog").innerHTML = out;
  
  //Starting our caroulsel with Jquery take a look at https://owlcarousel2.github.io/OwlCarousel2/docs/started-installation.html
  $('.owl-carousel').owlCarousel({
    loop:true,
    margin: 0,
    nav:true,
    items: 1,
    lazyload: true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
  })
}