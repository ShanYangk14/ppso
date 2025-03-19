function calculateSecantMethod() {
    document.getElementById("solution").innerHTML = "";
    document.getElementById("error").innerHTML = "";
    let tbody = document.querySelector("#resultTable tbody");
    tbody.innerHTML = ""; // Xóa nội dung cũ của bảng

    try {
        // Lấy giá trị từ các ô nhập liệu
        let equation = document.getElementById("equation").value;
        let x0 = parseFloat(document.getElementById("a").value);
        let x1 = parseFloat(document.getElementById("b").value);
        let epsilon = parseFloat(document.getElementById("epsilon").value);
        let maxIterations = parseInt(document.getElementById("maxIterations").value);

        // Hàm f(x) được định nghĩa dựa trên phương trình nhập vào
        function f(x) {
            return eval(equation.replace(/x/g, `(${x})`));
        }

        let iter = 0, x2;
        let steps = `<strong>Các bước tính toán chi tiết:</strong><br>`;

        while (iter < maxIterations) {
            let f0 = f(x0);
            let f1 = f(x1);

            steps += `<br><strong>Bước ${iter + 1}:</strong><br>`;
            steps += `1. Tính giá trị f(x0): f(${x0.toFixed(6)}) = ${f0.toFixed(6)}<br>`;
            steps += `2. Tính giá trị f(x1): f(${x1.toFixed(6)}) = ${f1.toFixed(6)}<br>`;

            // Kiểm tra điều kiện chia cho số gần bằng 0
            if (Math.abs(f1 - f0) < 1e-10) {
                steps += `Lỗi: Chia cho số gần bằng 0!<br>`;
                document.getElementById("error").innerText = "Lỗi: Chia cho số gần bằng 0!";
                document.getElementById("solution").innerHTML = steps;
                return;
            }

            // Tính giá trị x2 theo công thức dây cung
            x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);
            steps += `3. Tính giá trị x2:<br>`;
            steps += `   x2 = x1 - [f(x1) * (x1 - x0)] / [f(x1) - f(x0)]<br>`;
            steps += `   x2 = ${x1.toFixed(6)} - [${f1.toFixed(6)} * (${x1.toFixed(6)} - ${x0.toFixed(6)})] / [${f1.toFixed(6)} - ${f0.toFixed(6)}]<br>`;
            steps += `   x2 = ${x2.toFixed(6)}<br>`;

            // Thêm hàng vào bảng kết quả
            let row = `<tr>
                <td>${iter + 1}</td>
                <td>${x0.toFixed(6)}</td>
                <td>${x1.toFixed(6)}</td>
                <td>${f0.toFixed(6)}</td>
                <td>${f1.toFixed(6)}</td>
                <td>${x2.toFixed(6)}</td>
            </tr>`;
            tbody.innerHTML += row;

            // Kiểm tra điều kiện dừng
            if (Math.abs(x2 - x1) < epsilon) {
                steps += `4. Kiểm tra điều kiện |x2 - x1| < ε:<br>`;
                steps += `   |${x2.toFixed(6)} - ${x1.toFixed(6)}| = ${Math.abs(x2 - x1).toFixed(6)} < ${epsilon}<br>`;
                steps += `<strong>Kết luận:</strong> Nghiệm gần đúng là ${x2.toFixed(6)} sau ${iter + 1} lần lặp.<br>`;
                document.getElementById("solution").innerHTML = steps;
                return;
            }

            // Chuẩn bị cho lần lặp tiếp theo
            steps += `5. Cập nhật giá trị: x0 = ${x1.toFixed(6)}, x1 = ${x2.toFixed(6)}<br>`;
            x0 = x1;
            x1 = x2;
            iter++;
        }

        // Nếu vượt quá số lần lặp tối đa
        steps += `<strong>Kết luận:</strong> Nghiệm gần đúng là ${x2.toFixed(6)} sau ${iter} lần lặp.<br>`;
        document.getElementById("solution").innerHTML = steps;

    } catch (error) {
        document.getElementById("error").innerText = "Lỗi: Dữ liệu nhập không hợp lệ!";
    }
}
