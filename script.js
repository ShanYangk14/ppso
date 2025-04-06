function calculateSecantMethod() {
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

        // Input validation
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
        let secantPointsX = [x0, x1];
        let secantPointsY = [f(x0), f(x1)];
        let errors = []; // Store errors for each iteration

        // Initial step (iter = 0) with x0 and x1
        stepsHTML += `
            <div class="step-box">
                <strong>Bước ${iter} (Khởi tạo):</strong>
                <p>Giá trị ban đầu: \\( x_0 = ${x0.toFixed(6)}, x_1 = ${x1.toFixed(6)} \\)</p>
                <p>\\( f(x_0) = ${f(x0).toFixed(6)}, f(x_1) = ${f(x1).toFixed(6)} \\)</p>
            </div>`;
        
        let row = `<tr>
            <td>${iter}</td>
            <td>${x0.toFixed/*******/(6)}</td>
            <td>${x1.toFixed(6)}</td>
            <td>${f(x0).toFixed(6)}</td>
            <td>${f(x1).toFixed(6)}</td>
            <td>-</td>
            <td>-</td>
        </tr>`;
        tbody.innerHTML += row;

        // Secant iterations
        while (iter < maxIterations) {
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

            let error = Math.abs(x2 - x1); // Calculate absolute error
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
                    <p>Sai số: \\( |x_${iter+2} - x_${iter+1}| = ${error.toFixed(6)} \\)</p>
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
            secantPointsY.push(f(x2));

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

        let layout = {
            title: 'Secant Method Visualization',
            xaxis: { title: 'x' },
            yaxis: { title: 'f(x)' },
            showlegend: true
        };

        Plotly.newPlot('plotlyGraph', [functionTrace, secantTrace], layout);

    } catch (error) {
        console.error(error);
        document.getElementById("error").innerText = "❌ Lỗi: Đã xảy ra lỗi không xác định!";
    }
}