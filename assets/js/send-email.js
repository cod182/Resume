function sendMail(contactForm) {
    emailjs.send('gmail','codie',{
        "from_name": contactForm.name.value,
        "from_email": contactForm.email.value,
        "project_request": contactForm.projectsummary.value
    })
    .then(
        function(response) {
            console.log('SUCSESS',response)
        },
        function(error) {
            console.log('FAILED', error)
        });
    return false;
}