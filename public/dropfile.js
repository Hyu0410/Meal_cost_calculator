    const dropFile = {
      handleFiles(files) {
        const filesContainer = document.getElementById("files");
        Array.from(files).forEach((file) => {
          const fileDiv = document.createElement("div");
          fileDiv.classList.add("file");

          const thumbDiv = document.createElement("div");
          thumbDiv.classList.add("thumbnail");

          if (file.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.classList.add("image");
            img.src = URL.createObjectURL(file);
            thumbDiv.appendChild(img);
          } else {
            const icon = document.createElement("img");
            icon.classList.add("image");
            icon.src = "https://img.icons8.com/pastel-glyph/2x/document.png";
            thumbDiv.appendChild(icon);
          }

          const detailsDiv = document.createElement("div");
          detailsDiv.classList.add("details");

          const headerDiv = document.createElement("div");
          headerDiv.classList.add("header");

          const nameDiv = document.createElement("div");
          nameDiv.classList.add("name");
          nameDiv.textContent = file.name;

          const sizeDiv = document.createElement("div");
          sizeDiv.classList.add("size");
          sizeDiv.textContent = (file.size / 1024 / 1024).toFixed(2) + " MB";

          headerDiv.appendChild(nameDiv);
          headerDiv.appendChild(sizeDiv);

          const progressDiv = document.createElement("div");
          progressDiv.classList.add("progress");

          const barDiv = document.createElement("div");
          barDiv.classList.add("bar");
          barDiv.style.width = "100%";

          progressDiv.appendChild(barDiv);

          detailsDiv.appendChild(headerDiv);
          detailsDiv.appendChild(progressDiv);

          const deleteBtn = document.createElement("button");
          deleteBtn.classList.add("delete-btn");
          deleteBtn.textContent = "삭제";
          deleteBtn.onclick = () => {
            fileDiv.remove();
          };

          fileDiv.appendChild(thumbDiv);
          fileDiv.appendChild(detailsDiv);
          fileDiv.appendChild(deleteBtn);

          filesContainer.appendChild(fileDiv);
        });
      },
    };
    