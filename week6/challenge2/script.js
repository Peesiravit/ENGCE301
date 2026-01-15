
            const paragraphs = document.querySelectorAll('#main p');

            for (let i = 0; i < paragraphs.length; i++) {

                if (paragraphs[i].textContent.includes("Llamas and Chickens!")) {

                    paragraphs[i].style.color = 'red';
                }
            }