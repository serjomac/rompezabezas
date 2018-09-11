function readURL(input, id) {
      console.log("Hola");
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                console.log(e.target.result);

                $('#'+id).attr('value', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
    

    $("#urlImg").change(function(){
      console.log("Hola 3");
        readURL(this, "urlInput");
    });

    console.log("Hola 2");