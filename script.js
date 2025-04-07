function calculateSecantMethod() {
    document.getElementById("solution").innerHTML = "";
    document.getElementById("mValue").innerHTML = "";
    document.getElementById("error").innerHTML = "";
    document.getElementById("steps").innerHTML = "";
    let tbody = document.querySelector("#resultTable tbody");
    tbody.innerHTML = "";

    try {
        let x0 = parseFloat(document.getElementById("a").value);
        let x1 = parseFloat(document.getElementById("b").value);
        let epsilon = parseFloat(document.getElementById("epsilon").value);
        let equation = document.getElementById("equation").value.trim();

        // Input validation
        if (isNaN(x0) || isNaN(x1) || isNaN(epsilon)) {
            document.getElementById("error").innerText = "❌ Lỗi: Vui lòng nhập đầy đủ các giá trị số!";
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

        // Tính đạo hàm bậc nhất của f(x)
        let derivative;
        try {
            derivative = math.derivative(equation, 'x').toString();
        } catch (error) {
            document.getElementById("error").innerText = "❌ Lỗi: Không thể tính đạo hàm của phương trình!";
            throw error;
        }

        function fPrime(x) {
            try {
                let result = math.evaluate(derivative, { x: x });
                if (!isFinite(result)) throw new Error("Đạo hàm không hợp lệ");
                return result;
            } catch (error) {
                document.getElementById("error").innerText = "❌ Lỗi: Không thể tính giá trị đạo hàm!";
                throw error;
            }
        }

        // Tìm giá trị nhỏ nhất của |f'(x)| trong khoảng [a, b] để làm m
        let m = Infinity;
        let step = (x1 - x0) / 100; // Chia khoảng [a, b] thành 100 điểm để tìm m
        for (let x = x0; x <= x1; x += step) {
            let fPrimeValue = Math.abs(fPrime(x));
            if (fPrimeValue < m && fPrimeValue > 0) {
                m = fPrimeValue;
            }
        }
        if (m === Infinity || m === 0) {
            document.getElementById("error").innerText = "❌ Lỗi: Không thể xác định giá trị m (đạo hàm bằng 0 hoặc không hợp lệ)!";
            return;
        }

        // Hiển thị giá trị m trong phần kết quả
        document.getElementById("mValue").innerHTML = `<strong>Giá trị m (min |f'(x)|):</strong> ${m.toFixed(6)}`;

        let iter = 0, x2;
        let stepsHTML = ``;
        let secantPointsX = [x0, x1];
        let secantPointsY = [f(x0), f(x1)];
        let errors = [];

        // Biến để kiểm tra vòng lặp vô cực
        let stagnationCount = 0;
        const stagnationThreshold = 5; // Số lần lặp liên tiếp không thay đổi để coi là vô cực
        const stagnationTolerance = 1e-10; // Ngưỡng để coi là "không thay đổi"
        let prevX2 = null;

        // Initial step (iter = 0) with x0 and x1
        stepsHTML += `
            <div class="step-box">
                <strong>Bước ${iter} (Khởi tạo):</strong>
                <p>Giá trị ban đầu: \\( x_0 = ${x0.toFixed(6)}, x_1 = ${x1.toFixed(6)} \\)</p>
                <p>\\( f(x_0) = ${f(x0).toFixed(6)}, f(x_1) = ${f(x1).toFixed(6)} \\)</p>
                <p>Giá trị m (min |f'(x)|): ${m.toFixed(6)}</p>
            </div>`;
        
        let row = `<tr>
            <td>${iter}</td>
            <td>${x0.toFixed(6)}</td>
            <td>${x1.toFixed(6)}</td>
            <td>${f(x0).toFixed(6)}</td>
            <td>${f(x1).toFixed(6)}</td>
            <td>-</td>
            <td>-</td>
        </tr>`;
        tbody.innerHTML += row;

        // Secant iterations
        while (true) { // Lặp vô hạn cho đến khi tìm được nghiệm hoặc phát hiện vòng lặp vô cực
            let f0 = f(x0);
            let f1 = f(x1);

            if (Math.abs(f1 - f0) < 1e-10) {
                document.getElementById("error").innerText = "⚠️ Lỗi: Chia cho số gần bằng 0!";
                return;
            }

            x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);

            if (!isFinite(x2) || isNaN(x2)) {
                document.getElementById("error").innerText = "❌ Lỗi: Giá trị tính toán không hợp lệ!";
                return;
            }

            // Kiểm tra vòng lặp vô cực
            if (prevX2 !== null) {
                let diff = Math.abs(x2 - prevX2);
                if (diff < stagnationTolerance) {
                    stagnationCount++;
                    if (stagnationCount >= stagnationThreshold) {
                        document.getElementById("error").innerText = "⚠️ Lỗi: Vòng lặp có thể vô cực, phương pháp không hội tụ!";
                        return;
                    }
                } else {
                    stagnationCount = 0; // Reset nếu giá trị thay đổi đáng kể
                }
            }
            prevX2 = x2;

            // Tính sai số mới: |f(x2)| / m
            let fx2 = f(x2);
            let error = Math.abs(fx2) / m;
            errors.push(error);

            stepsHTML += `
                <div class="step-box">
                    <strong>Bước ${iter + 1}:</strong> 
                    <p>Giá trị hiện tại: \\( x_${iter} = ${x0.toFixed(6)}, x_${iter+1} = ${x1.toFixed(6)} \\)</p>
                    <p>\\( f(x_${iter}) = ${f0.toFixed(6)}, f(x_${iter+1}) = ${f1.toFixed(6)} \\)</p>
                    <p>
                        \\[ x_${iter+2} = x_${iter+1} - 
                        \\frac{f(x_${iter+1}) \\times (x_${iter+1} - x_${iter})}
                        {f(x_${iter+1}) - f(x_${iter})} \\]
                    </p>
                    <p>Kết quả: \\( x_${iter+2} = \\mathbf{${x2.toFixed(6)}} \\)</p>
                    <p>Sai số: \\( \\frac{|f(x_${iter+2})|}{m} = \\frac{|${fx2.toFixed(6)}|}{${m.toFixed(6)}} = ${error.toFixed(6)} \\)</p>
                </div>`;

            row = `<tr>
                <td>${iter + 1}</td>
                <td>${x0.toFixed(6)}</td>
                <td>${x1.toFixed(6)}</td>
                <td>${f0.toFixed(6)}</td>
                <td>${f1.toFixed(6)}</td>
                <td><strong>${x2.toFixed(6)}</strong></td>
                <td>${error.toFixed(6)}</td>
            </tr>`;
            tbody.innerHTML += row;

            secantPointsX.push(x2);
            secantPointsY.push(fx2);

            if (error < epsilon) {
                let finalValue = f(x2);
                document.getElementById("solution").innerHTML = `
                    <strong>✅ Nghiệm gần đúng:</strong> <span class="solution-highlight">${x2.toFixed(6)}</span>
                    sau <strong>${iter + 1}</strong> lần lặp.
                    <br><strong>f(x) tại nghiệm:</strong> ${finalValue.toFixed(6)}
                    <br><strong>Sai số cuối:</strong> ${error.toFixed(6)}
                `;
                break;
            }

            x0 = x1;
            x1 = x2;
            iter++;
        }

        document.getElementById("steps").innerHTML = stepsHTML;
        MathJax.typeset();

        // Generate graph data
        let xMin = Math.min(...secantPointsX) - 1;
        let xMax = Math.max(...secantPointsX) + 1;
        let xValues = [];
        let yValues = [];
        for (let x = xMin; x <= xMax; x += 0.1) {
            xValues.push(x);
            yValues.push(f(x));
        }

        // Tính toán phạm vi trục y dựa trên giá trị thực tế
        let yMin = Math.min(...yValues, ...secantPointsY) - 1;
        let yMax = Math.max(...yValues, ...secantPointsY) + 1;

        // Plotly data
        let functionTrace = {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'lines',
            name: 'f(x)',
            line: { color: 'blue' }
        };

        let secantTrace = {
            x: secantPointsX,
            y: secantPointsY,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Secant Iterations',
            line: { color: 'red', dash: 'dash' },
            marker: { size: 8 }
        };

        // Define layout with enhanced axes
        let layout = {
            title: 'Secant Method Visualization',
            xaxis: {
                title: 'Trục X',
                zeroline: true,
                zerolinewidth: 2,
                zerolinecolor: '#000',
                gridcolor: '#ddd',
                gridwidth: 1,
                range: [xMin, xMax]
            },
            yaxis: {
                title: 'Trục Y (f(x))',
                zeroline: true,
                zerolinewidth: 2,
                zerolinecolor: '#000',
                gridcolor: '#ddd',
                gridwidth: 1,
                range: [yMin, yMax],
                scaleanchor: 'x',
                scaleratio: 1
            },
            showlegend: true,
            plot_bgcolor: '#f9f9f9',
            paper_bgcolor: '#fff',
            margin: { t: 40, b: 40, l: 40, r: 40 },
            autosize: true
        };

        document.getElementById('plotlyGraph').style.width = '100%';
        document.getElementById('plotlyGraph').style.height = '400px';

        Plotly.newPlot('plotlyGraph', [functionTrace, secantTrace], layout);
    } catch (error) {
        console.error(error);
        document.getElementById("error").innerText = "❌ Lỗi: Đã xảy ra lỗi không xác định!";
    }
}