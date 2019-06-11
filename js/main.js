
$(document).ready(function(){
    init();
});

function init() {
    yearInFotter();
    
    setTimeout(function(){
        typeGreeting();
    },2000);
    
    listeners();

    $("#loading").fadeOut();
}

function yearInFotter() {
    
    let date = new Date();
    $("#footerDate").text(date.getFullYear());  
}

function typeGreeting() {
    
    let count = 0;
    const $greeting = $("#desc");
    const caption = "Cześć." + "<br>" +
                    "Mam na imię Piotrek." + "<br>" +
                    "Witaj na mojej stronie." + "<br>" +
                    "Szukam pracy na stanowisku " + "<br>" +
                    "Junior Front-End Developer.";
    let addChar = "";
       
    function typing() {
        
        if (count < caption.length) {
       
            addChar += caption.charAt(count);
                        
            if (caption.charAt(count) !== "<")
                $greeting.html(addChar);
          
            setTimeout(typing,60);
            count++;
            
        }
    }
    
    typing();
}

function listeners() {
    
    $("#contact, #projects, #about").on("click", function(e) {

        e.preventDefault();

        if ($('#mycv').is(':visible'))
            $('#mycv').toggle(200);
        
        const $panels = $(".panel");
        const $wrapperContent = $("#wrapper-content");
        const $id = $(this)[0].id;
        const href = window.location.href;
        let $load = $("#loading");

        if (href.includes("kontakt") || href.includes("osobie") || href.includes("portfolio")) {
            
            $load.fadeIn();

            $('html, body').scrollTop(0);
            
            $wrapperContent.slideToggle(400, function() {

                setElements($wrapperContent,$id);
                $load.fadeOut();

            });

        }
        else 
            $wrapperContent.fadeOut(400, function(){
            
            let i = 0;
            $load.fadeIn();
            
            $panels.animate({
                "width" : "0%"
            },500,"linear", function(){
                if (i === 1)
                    setElements($wrapperContent,$id);
                i++;
                $load.fadeOut();
            });
        });
                     
    });

    $("#menu-svg").on("click", function() {
        
        $("#menu-svg").toggleClass("anim");
    
    });
}

function setElements($content,$id) {
 
        let $con = $content;
        const id = $id;

        if (id === "contact") contact(id,$con);
        else if (id === "about") about(id,$con);
        else if (id === "projects") projects(id,$con);
}

 // about functions
function about($this,$content) {
    
    $content.load("about.html", function() {
        
        window.history.pushState("about","about","osobie");
        
        $content.delay(200).fadeIn(400, function(){
            $("#mycv").toggle(200);
        });
        
    });
}

// contact functions
function contact($this,$content) {
   
    $content.load("contact.html", function() {
        
        window.history.pushState("contact","contact","kontakt");

        $content.delay(200).toggle(400, function(){
            
            let $formElements = $("#form-elements").children();

            $formElements.each(function(i,val){
                
                if (i%2 === 0)
                    $(val).toggle('slide', {direction: 'right'}, 'slow');
                else
                    $(val).toggle('slide', {direction: 'left'}, 'slow');
                   
            });
        });

        if ($(document).innerWidth() > 767)
            $(this).find("#social-media-contact").delay(1000).slideToggle(300);

        sendEmail();

        $("a[href='#contact-form']").on("click", function(e) {
            
            e.preventDefault();

            $("body, html").animate({
                scrollTop: e.currentTarget.offsetParent.offsetTop 
            });
        });

     });
}

// projects functions
function projects($this,$content) {

    $content.load("projects.html", function(){

        window.history.pushState("projects","projects","portfolio");
        
        $content.delay(200).toggle(400);
        
        $(".close-info").on("click", function(){
        
            const id = $(this).parents("article");

            let pos = $(".buttons-projects").find("a[href='#"+id[0].id+"']").parents("article").offset().top;
            
            $("html,body").animate({
                scrollTop: pos-50
            },500,"linear",function(){
                id.collapse("toggle");
            });
        
        });

        $(".buttons-projects a[href^='#']").on("click", function(e) {

            e.preventDefault(); 

            let $id = $($(this).attr("href"));

            const $coll = $id.siblings(".collapse");

            $this = $coll.filter(function(i) {
                return $coll[i].clientHeight > 0
            });

            let pos = $id.parent("#projects-informations")[0].offsetTop;
            
            if ($this.length > 0)
            {
                $this.collapse("toggle");
                   
                    if (pos > 0)
                    $('html, body').animate({ scrollTop: pos }, "slow");  
            }   
            else 
                if (pos > 0)
                    $('html, body').animate({ scrollTop: pos }, "slow");  

        });
    });
}

//added functions 
function sendEmail() {
    
    $(document).on("submit","#form-elements", function(e){

        e.preventDefault();
    
        const data = $(this).serialize();

        $.ajax({
            url: "js/main.php",
            type: "POST",
            data: data,
            success: function(resp) {
                let info = (resp.includes("Message has been sent")) ? "Wiadomość została wysłana. Odpowiem na nią najszybciej jak to będzie możliwe. Pozdrawiam." : "Niestety wiadomość nie została wysłana. Wystąpił nieoczykiwany błąd. Spróbuj ponownie później. Pozdrawiam.";
                // tworzenie okna ze zwrotną informacją
                const modal = new Modal(info);
                modal.showInfo();
                //resetowanie formularza gdy wiadomosc wyslana    
                if (resp.includes("Message has been sent"))
                    $("#form-elements")[0].reset();
            },
            error: function(e) {
                const modal = new Modal("Niestety wiadomość nie została wysłana. Wystąpił nieoczykiwany błąd. Spróbuj ponownie później. Pozdrawiam.");
                modal.showInfo();
            }
        });
    
    });
}
//modal
function Modal(info) {

    this.info = info;

    this.showInfo = function() {
        
        let modal = "<div class='modal fade' id='modal-info' tabIndex='-1' role='dialog'>"+
                        "<div class='modal-dialog modal-dialog-centered' role='document'>"+
                            "<div class='modal-content'>"+
                                "<div class='modal-header'>"+
                                    "<h5 class='modal-title'>Informacja</h5>"+
                                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                                        "<span aria-hidden='true'>x</span>"+
                                    "</button>"+
                                "</div>"+
                                "<div class='modal-body'>"+
                                    "<p>"+this.info+"</p>"+
                                "</div>"+
                                "<div class='modal-footer'>"+
                                    "<button type='button' class='btn btn-primary' data-dismiss='modal'>Zamknij</button>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>";

        $("body").append(modal);
        $("#modal-info").modal("show"); 
    }
}

