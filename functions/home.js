$("#test1").click(function () {
    window.location.pathname = './typing1.html';
});
$("#test2").click(function () {
    window.location.pathname = './typing2.html';
});
$("#test1i").click(async function () {
    $("#info").addClass("hidden")
    $("#name").text("TyperX 1")
    $("#description").text("This typing test allows users to pause at any point, offering flexibility for those who need breaks. Ideal for beginners, it provides a low-pressure environment to practice typing speed and accuracy. The test is designed to help users gradually improve their typing skills without the need for continuous practice.");
    setTimeout(() => {
        $("#info").removeClass("hidden")
    }, 100);
})
$("#test2i").click(function () {
    $("#info").addClass("hidden")
    $("#name").text("TyperX 2")
    $("#description").text("This typing test is designed for intermediate typists and cannot be paused or stopped once started, providing a continuous challenge. It pushes users to maintain focus and consistency throughout the test, helping them improve their typing speed and accuracy under pressure. Ideal for those looking to enhance their typing proficiency");
    setTimeout(() => {
        $("#info").removeClass("hidden")
    }, 100);
})

$("#close").click(function () {
    $("#info").addClass("hidden")
})