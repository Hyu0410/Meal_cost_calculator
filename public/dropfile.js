document.addEventListener("DOMContentLoaded", () => {
  const dropFile = {
    filesList: [],

    handleFiles(files) {
      // 새로 선택된 파일들을 배열로 변환 후 기존 배열에 추가
      this.filesList = this.filesList.concat(Array.from(files));

      this.renderFiles();
    },

    removeFile(index) {
      this.filesList.splice(index, 1);
      this.renderFiles();
    },

    renderFiles() {
      const filesContainer = document.getElementById("files");
      filesContainer.innerHTML = "";

      this.filesList.forEach((file, index) => {
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

        detailsDiv.appendChild(headerDiv);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "삭제";
        deleteBtn.onclick = () => {
          this.removeFile(index);
        };

        fileDiv.appendChild(thumbDiv);
        fileDiv.appendChild(detailsDiv);
        fileDiv.appendChild(deleteBtn);

        filesContainer.appendChild(fileDiv);
      });
    },
  };

  window.dropFile = dropFile;

  document.getElementById("calculateBtn").addEventListener("click", () => {
    if (dropFile.filesList.length < 2) {
      alert("파일을 두 개 이상 업로드해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("workLogFile", dropFile.filesList[0]);
    formData.append("mealOrderFile", dropFile.filesList[1]);

    const month = document.getElementById("month").value;
    if (!month) {
      alert("월을 선택해주세요.");
      return;
    }
    formData.append("month", month);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then((data) => {
        alert("업로드 성공: " + data);
      })
      .catch((err) => {
        console.error("업로드 실패", err);
      });
  });
});
