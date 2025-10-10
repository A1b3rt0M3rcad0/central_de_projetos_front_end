import { useRef, useEffect, useState } from "react";
import { Download, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";
import jsPDF from "jspdf";

/**
 * Componente para visualização da EAP em formato de árvore hierárquica
 * Similar ao exemplo da imagem com códigos WBS e cores por nível
 */
export default function EAPTreeDiagram({ eapData, onExport, onFullscreen, className = "" }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Configurações visuais baseadas na imagem
  const NODE_CONFIG = {
    width: 280,
    height: 60,
    spacing: {
      horizontal: 320, // Espaçamento horizontal entre nós
      vertical: 120, // Espaçamento vertical entre níveis
    },
    colors: {
      level1: { bg: "#006064", text: "#ffffff", border: "#004d52" }, // Teal escuro
      level2: { bg: "#80deea", text: "#000000", border: "#4dd0e1" }, // Teal claro
      level3: { bg: "#b2ebf2", text: "#000000", border: "#80deea" }, // Teal muito claro
      level4: { bg: "#e0f7fa", text: "#000000", border: "#b2ebf2" }, // Teal super claro
    },
    font: {
      family: "Inter, system-ui, sans-serif",
      sizes: {
        title: 14,
        subtitle: 12,
        code: 11,
      },
    },
  };

  // Calcula posições dos nós na árvore
  const calculateNodePositions = (items, startX = 0, startY = 0, level = 1) => {
    const positions = [];
    let currentY = startY;

    items.forEach((item, index) => {
      const nodePosition = {
        id: item.id,
        x: startX,
        y: currentY,
        level: level,
        item: item,
        children: [],
      };

      // Se tem filhos, calcula posições recursivamente
      if (item.children && item.children.length > 0) {
        const childY = currentY + NODE_CONFIG.spacing.vertical;
        const childPositions = calculateNodePositions(
          item.children,
          startX + NODE_CONFIG.spacing.horizontal,
          childY,
          level + 1
        );
        nodePosition.children = childPositions;
        positions.push(...childPositions);
      }

      positions.unshift(nodePosition);
      currentY += NODE_CONFIG.spacing.vertical;
    });

    return positions;
  };

  // Desenha um nó da árvore
  const drawNode = (ctx, position) => {
    const { x, y, level, item } = position;
    const config =
      NODE_CONFIG.colors[`level${Math.min(level, 4)}`] ||
      NODE_CONFIG.colors.level4;

    // Retângulo principal
    ctx.fillStyle = config.bg;
    ctx.strokeStyle = config.border;
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, NODE_CONFIG.width, NODE_CONFIG.height);
    ctx.strokeRect(x, y, NODE_CONFIG.width, NODE_CONFIG.height);

    // Código WBS (topo esquerdo)
    ctx.fillStyle = config.text;
    ctx.font = `bold ${NODE_CONFIG.font.sizes.code}px ${NODE_CONFIG.font.family}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(item.code || `${item.id}`, x + 8, y + 8);

    // Título do item (centro)
    ctx.font = `${NODE_CONFIG.font.sizes.title}px ${NODE_CONFIG.font.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Quebra linha se necessário
    const maxWidth = NODE_CONFIG.width - 16;
    const words = item.name.split(" ");
    let line = "";
    let lineY = y + NODE_CONFIG.height / 2 - 8;

    words.forEach((word) => {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && line !== "") {
        ctx.fillText(line, x + NODE_CONFIG.width / 2, lineY);
        line = word + " ";
        lineY += 16;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, x + NODE_CONFIG.width / 2, lineY);

    // Tipo do item (canto inferior direito)
    if (item.type) {
      ctx.font = `${NODE_CONFIG.font.sizes.subtitle}px ${NODE_CONFIG.font.family}`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(
        item.type.toUpperCase(),
        x + NODE_CONFIG.width - 8,
        y + NODE_CONFIG.height - 8
      );
    }
  };

  // Desenha conexões entre nós
  const drawConnections = (ctx, positions) => {
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    positions.forEach((position) => {
      if (position.children.length > 0) {
        const parentX = position.x + NODE_CONFIG.width;
        const parentY = position.y + NODE_CONFIG.height / 2;

        // Linha horizontal do pai
        ctx.beginPath();
        ctx.moveTo(parentX, parentY);
        ctx.lineTo(parentX + 40, parentY);
        ctx.stroke();

        // Linha vertical para os filhos
        const firstChild = position.children[0];
        const lastChild = position.children[position.children.length - 1];

        if (firstChild && lastChild) {
          const childX = firstChild.x - 40;
          const topChildY = firstChild.y + NODE_CONFIG.height / 2;
          const bottomChildY = lastChild.y + NODE_CONFIG.height / 2;

          ctx.beginPath();
          ctx.moveTo(parentX + 40, parentY);
          ctx.lineTo(childX, parentY);
          ctx.lineTo(childX, topChildY);
          ctx.lineTo(childX, bottomChildY);
          ctx.stroke();

          // Linhas horizontais para cada filho
          position.children.forEach((child) => {
            ctx.beginPath();
            ctx.moveTo(childX, child.y + NODE_CONFIG.height / 2);
            ctx.lineTo(child.x, child.y + NODE_CONFIG.height / 2);
            ctx.stroke();
          });
        }
      }
    });
  };

  // Renderiza a árvore no canvas
  const renderTree = () => {
    if (!eapData?.items || !svgRef.current) return;

    const canvas = svgRef.current;
    const ctx = canvas.getContext("2d");

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aplica zoom e posição
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(position.x, position.y);

    // Calcula posições dos nós
    const positions = calculateNodePositions(eapData.items);

    // Desenha conexões primeiro (atrás dos nós)
    drawConnections(ctx, positions);

    // Desenha os nós
    positions.forEach((position) => {
      drawNode(ctx, position);
    });

    ctx.restore();
  };

  // Atualiza o tamanho do canvas
  const updateCanvasSize = () => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = svgRef.current;

    canvas.width = container.offsetWidth;
    canvas.height = Math.max(container.offsetHeight, 800);

    renderTree();
  };

  // Eventos de zoom e pan
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Controles de zoom
  const zoomIn = () => setZoom((prev) => Math.min(3, prev * 1.2));
  const zoomOut = () => setZoom((prev) => Math.max(0.1, prev / 1.2));
  const resetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  const fitToScreen = () => {
    // Implementar ajuste automático ao tamanho da tela
    setZoom(0.8);
    setPosition({ x: 50, y: 50 });
  };

  // Exporta a árvore como imagem
  const exportAsImage = (format = "png") => {
    if (!svgRef.current) return;

    const canvas = svgRef.current;

    if (format === "png") {
      const link = document.createElement("a");
      link.download = `EAP_${eapData.name}_${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else if (format === "pdf") {
      try {
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        // Adiciona título
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(eapData.name || "Estrutura Analítica do Projeto", 20, 20);

        // Adiciona data
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(
          `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
          20,
          30
        );

        // Adiciona a imagem da árvore
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 250; // Largura da imagem no PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Ajusta a altura da imagem se necessário
        const maxHeight = 200;
        const finalHeight = Math.min(imgHeight, maxHeight);
        const finalWidth = (canvas.width * finalHeight) / canvas.height;

        pdf.addImage(imgData, "PNG", 20, 40, finalWidth, finalHeight);

        // Adiciona informações da EAP
        pdf.setFontSize(10);
        pdf.text(
          `Total de itens: ${eapData.items?.length || 0}`,
          20,
          40 + finalHeight + 10
        );
        pdf.text(
          `Descrição: ${eapData.description || "Sem descrição"}`,
          20,
          40 + finalHeight + 20
        );

        // Salva o PDF
        const fileName = `EAP_${eapData.name}_${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        pdf.save(fileName);
      } catch (error) {
        console.error("Erro ao exportar PDF:", error);
        alert("Erro ao exportar PDF. Tente exportar como PNG.");
      }
    }
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    renderTree();
  }, [eapData, zoom, position]);

  if (!eapData?.items || eapData.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum item na EAP
          </h3>
          <p className="text-gray-600">
            Adicione itens à EAP para visualizar a árvore hierárquica
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-lg border border-gray-200 ${className}`}
    >
      {/* Controles */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
        <button
          onClick={zoomOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Diminuir zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-sm font-medium min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={zoomIn}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Aumentar zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          onClick={resetView}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Resetar visualização"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={fitToScreen}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Ajustar à tela"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Tela cheia"
          >
            <Maximize2 className="w-4 h-4 text-blue-600" />
          </button>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => exportAsImage("png")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Exportar como PNG"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => exportAsImage("pdf")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
            title="Exportar como PDF"
          >
            📄
          </button>
        </div>
      </div>

      {/* Canvas da árvore */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={svgRef}
          className="block"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        />
      </div>

      {/* Informações da EAP */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
        <div className="text-sm">
          <div className="font-medium text-gray-900">{eapData.name}</div>
          <div className="text-gray-600">
            {eapData.items?.length || 0} itens •{" "}
            {eapData.description || "Estrutura Analítica do Projeto"}
          </div>
        </div>
      </div>
    </div>
  );
}
