var xmlhttp = new XMLHttpRequest();

//Url with the Json
var url = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ThiagoSFontes/";

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var myJson = JSON.parse(this.responseText);
    createCarousel(myJson);
  }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();

function getImage(str) {
  //Regular expression to find image source attribute
  var regex = /<img.*?src=['"](.*?)['"]/;
  try {
    return regex.exec(str.substr(0, 1200))[1];
  } catch (err) {
    return 'img/image.jpg';
  }
}

function createCarousel(myJson) {
  var blogContainer = document.getElementById("blog");
  blogContainer.innerHTML = '';
  for (var i = 0; i < myJson.items.length; i++) {
    // Create carousel item as a div
    var item = document.createElement('div');
    item.className = 'box-border left-up-notch';

    // Container for blog content
    var container = document.createElement('div');
    container.className = 'left-up-notch blog-item';
    container.style.cursor = 'pointer';
    // Add click handler to open Medium article
    (function (link, el) {
      el.onclick = function () {
        window.open(link, '_blank');
      };
    })(myJson.items[i].link, container);

    // Image
    var postImg = document.createElement('img');
    var imgSrc = getImage(myJson.items[i].description);
    if (imgSrc && imgSrc !== -1) {
      postImg.src = imgSrc;
      postImg.classList.add('itemImg');
    }

    // Title
    var title = document.createElement('h2');
    title.className = 'item-title';
    title.appendChild(document.createTextNode(myJson.items[i].title));

    // Description
    var texts = document.createElement('div');
    texts.classList.add('texts');
    texts.appendChild(title);
    texts.insertAdjacentHTML('beforeend', myJson.items[i].description.replace(/<figure>.*?<\/figure>/g, "").substring(0, 100) + '...');

    // Assemble item
    container.appendChild(postImg);
    container.appendChild(texts);
    item.appendChild(container);
    blogContainer.appendChild(item);
  }

  // Destroy previous Owl Carousel instance if exists
  if ($('#blog').hasClass('owl-loaded')) {
    $('#blog').trigger('destroy.owl.carousel');
    $('#blog').removeClass('owl-loaded owl-drag');
    $('#blog').find('.owl-stage-outer').children().unwrap();
  }

  // Initialize Owl Carousel specifically for the blog section
  $('#blog').owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
    items: 1,
    lazyLoad: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  });

  // Allow anchor tags to be clickable inside carousel
  $('#blog').on('click', 'a', function (e) {
    e.stopPropagation();
  });
}