// valors per defecte
var numFiles=2, numColumnes=2, rightPlaceCnt=0;
var nomImatge="img-2", extImatge=".jpg"; 
var fsolved=false, solved=false;

let audio={
    "Avengers":new Audio("audio/vengadores.mp3"),
    "Tada":new Audio("audio/tada.mp3")
};


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
        
        numFiles=$("#files").val(); numColumnes=$("#columnes").val();

        creaPuzzle();
        $(".peca")
        .mousedown(function(){
            zIndexPeca=$(this).css("z-index");
            $(this).css("z-index",100);
        })
        .mouseup(function(){
            posicionaPeca($(this));
            if(puzzleResolt() && !fsolved){
                felicitacio();
            }
        });

    });    
    $("#resolPuzzle").on("click",function(){
        fsolved=true; resolPuzzle();
    });

    $("#nouPuzzle").on("click", function(){ location.reload(); });

    $("#form-menu img").on("click",function(){
        $("#"+nomImatge).css("border-color", "transparent");
        $(this).css("border-color", "black");
        nomImatge=$(this).attr("id");
    });    
});


function creaPuzzle(){
    updateCounter();

    $("#form-joc").show();
    ampladaPeca=Math.floor($("#p-"+nomImatge).width()/numColumnes);
    alcadaPeca=Math.floor($("#p-"+nomImatge).height()/numFiles);

    $("#peces-puzzle").html(crearPeces());
    $(".peca").css({
        "width" : ampladaPeca+"px",
        "height" : alcadaPeca+"px",
    });   
    
    setImatgePosicioPeces();
   
	$("#marc-puzzle").css({
        "width":(ampladaPeca*numColumnes)+"px", 
        "height":(alcadaPeca*numFiles)+"px"
    });

    $("#solucio").css({
        "width":"100%",
        "height":"100%"
    });

    if (!$("#difficult").is(":checked"))
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
            $("#f"+fila+"c"+columna).css({
                "background-position":(-(columna)*ampladaPeca)+"px "+(-(fila)*alcadaPeca)+"px",
                "left":Math.floor(Math.random()*((numColumnes-1)*ampladaPeca))+"px ",
                "top": Math.floor(Math.random()*((numFiles-1)*alcadaPeca))+"px ",
                "z-index":"10"
            });
        }        
    }   
}

function posicionaPeca(peca){
    let posicioPeca=peca.position();
    let elem_id=peca.attr('id');

    posicioPecaCorrecte={
        left:parseInt(elem_id[3])*$("#marc-puzzle").width()/numColumnes,    // x
        top:parseInt(elem_id[1])*$("#marc-puzzle").height()/numFiles        // y
    };
    

    if (
        distanciaDosPunts(posicioPeca, posicioPecaCorrecte)<50 && 
        !$(peca).data("ui-draggable").options.disabled
    ){ 
        peca.css({
            "left":posicioPecaCorrecte.left+"px ",
            "top":posicioPecaCorrecte.top+"px ",
            "z-index":"1"
        });

        peca.draggable("disable");
        audio["Tada"].play();
        rightPlaceCnt++; updateCounter();
    }
}

function resolPuzzle(){
    $(".peca").draggable("disable").css("transition", "all 1s");
    for (let fila=0; fila<numFiles; fila++){
        for (let columna=0; columna<numColumnes; columna++){
            $("#f"+fila+"c"+columna).css({
                "top":(fila*$("#marc-puzzle").height()/numFiles)+"px",
                "left":(columna*$("#marc-puzzle").width()/numColumnes)+"px"
            });
        }        
    }
    deshabilitaBoto("resolPuzzle");
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
   deshabilitaBoto("resolPuzzle");
   return true
}

function distanciaDosPunts(puntA, puntB){
    return (Math.sqrt( Math.pow( puntB.left-puntA.left,2 ) + Math.pow( puntB.top-puntA.top ,2) ));
}

function deshabilitaBoto(id){
    $("#"+id).prop("disabled", true).css("cursor", "not-allowed");
}

function updateCounter(){
    $("#counter").text(rightPlaceCnt+"/"+(numFiles*numColumnes));
}

function felicitacio(){
    $("#felicitacio").show();  
    $("#felicitacio h1").flashUnlimited();    
    audio["Avengers"].play();

    $("#counter").css("color", "green");
}