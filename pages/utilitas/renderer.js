document.querySelectorAll('input[type="radio"][name="radio"]').forEach(e => {
    e.addEventListener('change', function() {
        if (this.value === "rubahPassword") {
            rubahPassword.style.display = "block";
        } else {
            rubahPassword.style.display = "none";
        }
    });
});
