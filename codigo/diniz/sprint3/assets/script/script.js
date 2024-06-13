//inicio index.html//

document.addEventListener("DOMContentLoaded", function () {
  const listaReceitas = document.getElementById("listaReceitas");

  function carregarReceitas() {
    fetch(
      "https://d2c501fa-4177-4d7b-a69b-81eb77e71b05-00-1wjvhqjrblfl5.kirk.replit.dev/favoritos?_expand=receitas"
    )
      .then((response) => response.json())
      .then((data) => {
        const favoritos = data
          .filter((item) => item.usuariosId == "1")
          .map((item) => {
            return {
              receita: item.receitas,
              id: item.id,
            };
          });
        mostraReceitas(favoritos);
      });
  }

  function mostraReceitas(favoritos) {
    console.log(favoritos);
    listaReceitas.innerHTML = "";
    favoritos.forEach((favorito) => {
      const receitasDiv = document.createElement("div");
      receitasDiv.className = "receita";
      receitasDiv.dataset.id = favorito.receita.id;
      receitasDiv.innerHTML = `
                <a href="./html/pagreceita.html?id=${favorito.receita.id}"><img src="${favorito.receita.imagem}" />
                <h3>${favorito.receita.nome}</h3></a>
                <button data-id="${favorito.id}" class="fav-btn"><i class="ph ph-trash fav-btn"></i></button>
            `;
      listaReceitas.appendChild(receitasDiv);
    });
  }

  document.body.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("fav-btn") ||
      event.target.closest(".fav-btn")
    ) {
      var confirmacao = confirm("Deseja desfavoritar essa receita?");
      if (confirmacao) {
        const button = event.target.closest("button.fav-btn");
        const favoritoId = button.dataset.id;
        fetch(
          `https://d2c501fa-4177-4d7b-a69b-81eb77e71b05-00-1wjvhqjrblfl5.kirk.replit.dev/favoritos/${favoritoId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then(() => {
            carregarReceitas();
          })
          .catch((error) => {
            console.error("Erro ao excluir favorito", error);
          });
      }
    }
  });

  carregarReceitas();
});

//fim index.html//

//inicio pagReceita.html//

document.addEventListener("DOMContentLoaded", function () {
  const receitaContainer = document.getElementById("pagReceita");

  function carregarReceita() {
    const receitaId = getReceitaIdFromURL();
    console.log(receitaId);
    fetch(
      `https://d2c501fa-4177-4d7b-a69b-81eb77e71b05-00-1wjvhqjrblfl5.kirk.replit.dev/receitas/${receitaId}`
    )
      .then((response) => response.json())
      .then((data) => {
        mostraReceita(data);
        setFavoritoButtonListener(data.id);
      });
  }

  function mostraReceita(receita) {
    console.log(receita);
    receitaContainer.innerHTML = `
            <h2 class="receita-nome">${receita.nome}</h2>
            <button class="favorito-btn"  data-id="${receita.id}">
            <i id="favoritoId-btn" class="ph ph-bookmark-simple"></i>
            </button>
            <img src="${receita.imagem}" class="receita-imagem"/>
            <p class="receita-descricao">${receita.tempo} - ${receita.rendimento} - ${receita.dificuldade}</p>
            <h3 class="titulo-ingredientes">Ingredientes:</h3>
            <ul class="receita-ingredientes">
                ${receita.ingredientes
                  .map(
                    (ingrediente) =>
                      `<li >${ingrediente.quantidade} ${ingrediente.ingrediente}</li>` )
                  .join("")}
            </ul>
            <h3 class="titulo-modo_preparo">Modo de Preparo:</h3>
            <ul class="receita-modo_preparo">
                ${receita.modo_preparo
                  .map((passo) => `<li>${passo}</li>`)
                  .join("")}
            </ul>
        `;
  }

  function getReceitaIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  function setFavoritoButtonListener(receitaId) {
    document.querySelector(".favorito-btn").addEventListener("click", function (event) {
      const button = event.target.closest(".favorito-btn");
      const receitasId = button.getAttribute("data-id");

      const jaFavoritado = button.classList.contains("favorito");
      const mensagemConfirmacao = jaFavoritado
        ? "Tem certeza que deseja desfavoritar esta receita?"
        : "Tem certeza que deseja favoritar esta receita?";

      if (confirm(mensagemConfirmacao)) {
        if (jaFavoritado) {
          fetch(`https://d2c501fa-4177-4d7b-a69b-81eb77e71b05-00-1wjvhqjrblfl5.kirk.replit.dev/favoritos?receitasId=${receitasId}&usuariosId=1`)
            .then((res) => res.json())
            .then((data) => {
              const favoritoId = data[0].id;
              return fetch(`https://d2c501fa-4177-4d7b-a69b-81eb77e71b05-00-1wjvhqjrblfl5.kirk.replit.dev/favoritos/${favoritoId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });
            })
            .then((response) => response.json())
            .then(() => {
              button.classList.remove("favorito");
            })
            .catch((error) => {
              console.error("Erro na requisição", error);
            });
        } else {
          fetch("https://d2c501fa-4177-4d7b-a69b-81eb77e71b05-00-1wjvhqjrblfl5.kirk.replit.dev/favoritos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ receitasId, usuariosId: "1" }),
          })
            .then((response) => response.json())
            .then(() => {
              button.classList.add("favorito");
            })
            .catch((error) => {
              console.error("Erro na requisição", error);
            });
        }
      }
    });
  }

  carregarReceita();
});

//fim pagReceita.html//
