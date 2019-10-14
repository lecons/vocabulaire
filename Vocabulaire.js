var g_currentWord = 0;
var g_wordList = ["travailler", "maison", "cela"];
var g_contexts = ["Il faut travailler fort", "C'est ma maison!", "Cela dit, c'est plutôt bon."];
var g_nbSuccess = 0;
var g_nbErrors = 0;
var g_nbConsecutiveSuccess = 0;

$(document).ready(function() {
    UpdateValues();
    $("#resultInput").focus();
    $("body").css("background-color", "lightyellow");
    $("#result").css("background-color", "white");

    $('#resultInput').keypress(function(e) {
            if (e.keyCode == 13) $('#checkButton').click();
        });
});


function Total()
{
    return g_nbSuccess + g_nbErrors;
}

function Say(msg)
{
    var ssu = new SpeechSynthesisUtterance(msg);
    ssu.lang = "fr-CA";
    window.speechSynthesis.speak(ssu);
    $("#resultInput").focus();

    return ssu;
}

function SayAndAlert(msg)
{
    //Say(msg);         // ne fonctionne pas, coupé par l'alerte...
    alert(msg);
}

function OnPlay()
{
    Say(g_wordList[g_currentWord]);
    Say("Comme dans");
    Say(g_contexts[g_currentWord]);

    Say(g_wordList[g_currentWord]);

    $("stats").val("Succes: " + g_nbSuccess + "<&nbsp><&nbsp><&nbsp><&nbsp>Erreurs: " + g_nbErrors);
}

function GenerateRandomInteger(maxValue)
{
    return Math.floor(Math.random() * maxValue);
}

function GenerateSuccessCode()
{
    now = new Date();
    return (now.getMonth()+1).toString() + now.getDate().toString() + now.getHours().toString() + now.getMinutes() + "-s" + g_nbSuccess + "-e" + g_nbErrors;
}

function OnCheck()
{
    window.speechSynthesis.cancel();

    if ($("#resultInput").val().trim().toLocaleLowerCase() == g_wordList[g_currentWord].toLocaleLowerCase())
    {
        Say("BRAVO!!").onend = function() {
            alert("BRAVO !");
        }
        
        ++g_nbSuccess;
        ++g_nbConsecutiveSuccess;
    }
    else
    {
        SayAndAlert("ERREUR.  La reponse est: " + g_wordList[g_currentWord]);
        ++g_nbErrors;
        g_nbConsecutiveSuccess = 0;
    }

    g_currentWord = (Total() >= g_wordList.length) ? GenerateRandomInteger(g_wordList.length-1): g_currentWord + 1;

    $("#resultInput").val("");
    $("#resultInput").focus();

    UpdateValues();

    if (g_nbConsecutiveSuccess < g_wordList.length) 
    {
        OnPlay();
    }
    else
    {
        $("body").css("background-color", "green");
        Say("Terminé!!").onend = function() {
            alert("Bravo, tu as maintenant terminé!  Écris le code " + GenerateSuccessCode() + " sur un papier et donne-le à papa ou maman!");
        }
        
    }
}

function UpdateValues()
{
    $("#nbSuccess").text(g_nbSuccess);
    $("#nbErrors").text(g_nbErrors);
    $("#nbConsecutiveSuccess").text(g_nbConsecutiveSuccess);
}
