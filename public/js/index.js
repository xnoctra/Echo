window.addEventListener("load", function () {
    showPage();
  });

  function showPage() {
    setTimeout(function () {
      var loader = document.getElementById("loader");
      loader.style.opacity = "0";
      setTimeout(function () {
        loader.style.display = "none";
        var content = document.getElementById("bootup");
        content.style.display = "block";
        setTimeout(function () {
          content.style.opacity = "1";
        }, 10); 
      }, 500); 
    }, 500);
  }

document
.getElementById("toggleBtn")
.addEventListener("click", function () {
  var sidebar = document.getElementById("sidebar");
  var closeIcon = document.getElementById("closeIcon");
  sidebar.classList.toggle("show");

  if (sidebar.classList.contains("show")) {
    closeIcon.classList.add("show");
  } else {
    closeIcon.classList.remove("show");
  }
});

document
.getElementById("closeIcon")
.addEventListener("click", function () {
  var sidebar = document.getElementById("sidebar");
  var closeIcon = document.getElementById("closeIcon");
  sidebar.classList.remove("show");
  setTimeout(function () {
    closeIcon.classList.remove("show");
  }, 1);
});

document.addEventListener("click", function (event) {
var sidebar = document.getElementById("sidebar");
var closeIcon = document.getElementById("closeIcon");
var toggleBtn = document.getElementById("toggleBtn");

if (
  !sidebar.contains(event.target) &&
  !toggleBtn.contains(event.target)
) {
  sidebar.classList.remove("show");
  setTimeout(function () {
    closeIcon.classList.remove("show");
  }, 1); 
}
});

// Utility Home

// Page loader

