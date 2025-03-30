function calculateSecantMethod() {
    // Xóa nội dung cũ
    document.getElementById("solution").innerHTML = "";
    document.getElementById("error").innerHTML = "";
    document.getElementById("steps").innerHTML = "";
    let tbody = document.querySelector("#resultTable tbody");
    tbody.innerHTML = "";

    try {
        let x0 = parseFloat(document.getElementById("a").value);
        let x1 = parseFloat(document.getElementById("b").value);
        let epsilon = parseFloat(document.getElementById("epsilon").value);
        let maxIterations = parseInt(document.getElementById("maxIterations").value);
        let equation = document.getElementById("equation").value.trim();

        // Kiểm tra dữ liệu đầu vào hợp lệ
        if (isNaN(x0) || isNaN(x1) || isNaN(epsilon) || isNaN(maxIterations)) {
            document.getElementById("error").innerText = "❌ Lỗi: Vui lòng nhập đầy đủ các giá trị số!";
            return;
        }
        if (maxIterations <= 0) {
            document.getElementById("error").innerText = "❌ Lỗi: Số lần lặp phải lớn hơn 0!";
            return;
        }
        if (epsilon <= 0) {
            document.getElementById("error").innerText = "❌ Lỗi: Sai số epsilon phải lớn hơn 0!";
            return;
        }
        if (!equation) {
            document.getElementById("error").innerText = "❌ Lỗi: Vui lòng nhập phương trình!";
            return;
        }

        function f(x) {
            try {
                let result = math.evaluate(equation, { x: x });
                if (!isFinite(result)) throw new Error("Kết quả không hợp lệ");
                return result;
            } catch (error) {
                document.getElementById("error").innerText = "❌ Lỗi: Không thể tính giá trị của phương trình!";
                throw error;
            }
        }

        let iter = 0, x2;
        let stepsHTML = ``;

        while (iter < maxIterations) {
            let f0 = f(x0);
            let f1 = f(x1);

            if (Math.abs(f1 - f0) < 1e-10) {
                document.getElementById("error").innerText = "⚠️ Lỗi: Chia cho số gần bằng 0!";
                return;
            }

            // Tính x2 bằng công thức dây cung
            x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);

            // Kiểm tra lỗi NaN hoặc Infinity
            if (!isFinite(x2) || isNaN(x2)) {
                document.getElementById("error").innerText = "❌ Lỗi: Giá trị tính toán không hợp lệ!";
                return;
            }

            // Hiển thị công thức từng bước
            stepsHTML += `
                <div class="step-box">
                    <strong>Bước ${iter + 1}:</strong> 
                    <p>Giá trị hiện tại: \\( x_{${iter}} = ${x0.toFixed(6)}, x_{${iter+1}} = ${x1.toFixed(6)} \\)</p>
                    <p>\\( f(x_{${iter}}) = ${f0.toFixed(6)}, \quad f(x_{${iter+1}}) = ${f1.toFixed(6)} \\)</p>
                    <p>
                        \\[ x_{${iter+2}} = x_{${iter+1}} - 
                        \\frac{f(x_{${iter+1}}) \\times (x_{${iter+1}} - x_{${iter}})}
                        {f(x_{${iter+1}}) - f(x_{${iter}})} \\]
                    </p>
                    <p>Kết quả: \\( x_{${iter+2}} \approx \\mathbf{${x2.toFixed(6)}} \\)</p>
                </div>`;

            // Thêm vào bảng kết quả
            let row = `<tr>
                <td>${iter + 1}</td>
                <td>${x0.toFixed(6)}</td>
                <td>${x1.toFixed(6)}</td>
                <td>${f0.toFixed(6)}</td>
                <td>${f1.toFixed(6)}</td>
                <td><strong>${x2.toFixed(6)}</strong></td>
            </tr>`;
            tbody.innerHTML += row;

            // Kiểm tra điều kiện dừng
            if (Math.abs(x2 - x1) < epsilon) {
                document.getElementById("solution").innerHTML = `
                    <strong>✅ Nghiệm gần đúng:</strong> <span class="solution-highlight">${x2.toFixed(6)}</span> 
                    sau <strong>${iter + 1}</strong> lần lặp.
                `;
                break;
            }

            // Cập nhật giá trị cho vòng lặp tiếp theo
            x0 = x1;
            x1 = x2;
            iter++;
        }

        document.getElementById("steps").innerHTML = stepsHTML;
        try {
            MathJax.typeset();
        } catch (e) {
            console.error("MathJax error:", e);
        }

    } catch (error) {
        console.error(error);
        document.getElementById("error").innerText = "❌ Lỗi: Đã xảy ra lỗi không xác định!";
    }
}
