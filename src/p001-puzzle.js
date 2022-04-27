
var numFiles=2;
var numColumnes=2;
var nomImatge = "img-2";
var extImatge = ".jpg";
var audio = {"Avengers":new Audio("audio\vengadores.mp3")};

$.fn.flashUnlimited=function(){
    $(this).fadeTo(500,0.3,function(){
        $(this).fadeTo(500,1, $(this).flashUnlimited); 
    });
} 

$(document).ready(function(){
    $("#jugar").on("click",function(){
        $("#form-menu").hide();
        $("#felicitacio").hide();
        
        $(".peca").css("transition", "none");

        numFiles = $("#files").val();
        numColumnes = $("#columnes").val();

        console.log(numFiles, numColumnes);

        creaPuzzle();
        $(".peca")
        .mousedown(function(){
            zIndexPeca = $(this).css("z-index");
            $(this).css("z-index",100);
        })
        .mouseup(function(){
            posicionaPeca($(this));
            if(puzzleResolt()){
                $("#felicitacio").show();  
                $("#felicitacio h1").flashUnlimited();    
                audio["Avengers"].play();
            }
        });

    });    
    $("#resolPuzzle").on("click",function(){
        resolPuzzle();
    });
    $("#nouPuzzle").on("click",function(){
        location.reload(); // optim?
    });

    $("#form-menu img").on("click",function(){
        console.log(this.attr("src"));
    });    
});

function creaPuzzle(){
    $("#form-joc").show();
    ampladaPeca = Math.floor($("#p-"+nomImatge).width()/numColumnes);
    alcadaPeca = Math.floor($("#p-"+nomImatge).height()/numFiles);

    $("#peces-puzzle").html(crearPeces());
    $(".peca").css({
        "width" : ampladaPeca+"px",
        "height" : alcadaPeca+"px",
    });   
    
    setImatgePosicioPeces();
   
	$("#marc-puzzle").css("width", (ampladaPeca*numColumnes)+"px");
	$("#marc-puzzle").css("height",( alcadaPeca*numFiles)+"px");
    $("#solucio").css("width", "100%");
    $("#solucio").css("height","100%");
    $("#solucio").css("background-image","url(img/"+nomImatge+ extImatge+")");

    $(".peca").draggable();
}

function crearPeces(){
    var htmlPeces = "";
    for (let fila=0; fila<numFiles; fila++){
        for (let columna=0; columna<numColumnes; columna++){
                htmlPeces +="<div id='f"+fila+"c"+columna+"' class='peca'></div>"; 
        }
        htmlPeces+="\n";
    }   
    return htmlPeces;
}

function setImatgePosicioPeces(){
    $(".peca").css("background-image","url(img/"+nomImatge+ extImatge+")");
    for (let fila=0; fila<numFiles; fila++){
        for (let columna=0; columna<numColumnes; columna++){
            $("#f"+fila+"c"+columna).css("background-position", (-(columna)*ampladaPeca)+"px "+(-(fila)*alcadaPeca)+"px");   
            $("#f"+fila+"c"+columna).css("left", Math.floor(Math.random()*((numColumnes-1)*ampladaPeca))+"px ");
            $("#f"+fila+"c"+columna).css("top", Math.floor(Math.random()*((numFiles-1)*alcadaPeca))+"px ");
            $("#f"+fila+"c"+columna).css("z-index","10");
        }        
    }   
}

function posicionaPeca(peca){
   
    let posicioPeca = peca.position();
    let elem_id=peca.attr('id');

    let row=parseInt(elem_id[1]);
    let col=parseInt(elem_id[3]);

    let h=$("#marc-puzzle").height()
    let l=$("#marc-puzzle").width()

    posicioPecaCorrecte={
        left:col*l/numColumnes, // x
        top:row*h/numFiles // y
    };
    if (distanciaDosPunts(posicioPeca, posicioPecaCorrecte)<50){  
        console.log(elem_id, "correcte!");
        peca.css("left", posicioPecaCorrecte.left+"px ");
        peca.css("top", posicioPecaCorrecte.top+"px "); 
        peca.css("z-index","1");
        peca.draggable("disable");
    }
}


function resolPuzzle(){
    $(".peca").css("transition", "all 2s");
    let h=$("#marc-puzzle").height(), l=$("#marc-puzzle").width();
    for (let fila=0; fila<numFiles; fila++){
        for (let columna=0; columna<numColumnes; columna++){
            $("#f"+fila+"c"+columna).css("top", (fila*l/numFiles)+"px");
            $("#f"+fila+"c"+columna).css("left", (columna*l/numColumnes)+"px");
        }        
   }
   
}

function puzzleResolt(){
    let h=$("#p-"+nomImatge).height(), l=$("#p-"+nomImatge).width();
    for (let fila=0; fila<numFiles; fila++){
        for (let columna=0; columna<numColumnes; columna++){
            posicioPecaCorrecte={
                left:columna*l/numColumnes, // x
                top:fila*h/numFiles // y
            }; 
            if (distanciaDosPunts(posicioPecaCorrecte, $("#f"+fila+"c"+columna).position())>10){
                return false;
            }
        }        
   }
   return true
}

function distanciaDosPunts(puntA, puntB){
    return (Math.sqrt( Math.pow( puntB.left-puntA.left,2 ) + Math.pow( puntB.top-puntA.top ,2) ));
}