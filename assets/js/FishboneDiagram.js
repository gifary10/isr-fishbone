// FishboneDiagram.js
import * as utils from './fishboneUtils.js';
import { getSolutionRelationships } from './correlationUtils.js';

export class FishboneDiagram {
  constructor(containerId, analysisData, allData) {
    this.containerId = containerId;
    this.analysisData = analysisData;
    this.allData = allData;
    this.solutionRelationships = getSolutionRelationships(analysisData, allData);
    this.tooltip = null;
  }

  render() {
    try {
      const container = document.getElementById(this.containerId);
      if (!container) {
        console.error(`Container with ID ${this.containerId} not found`);
        return;
      }

      container.innerHTML = '<div class="fishbone-tooltip" role="tooltip" aria-hidden="true"></div>';
      this.tooltip = d3.select('.fishbone-tooltip');
      
      const width = container.clientWidth;
      const height = 450;
      const centerY = height / 2;
      const spineLength = width * 0.8;
      const spineStartX = width * 0.1;
      const spineEndX = spineStartX + spineLength;

      const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('role', 'img')
        .attr('aria-label', 'Diagram Fishbone')
        .append('g');

      // Draw main spine
      svg.append('line')
        .attr('x1', spineStartX)
        .attr('y1', centerY)
        .attr('x2', spineEndX)
        .attr('y2', centerY)
        .attr('class', 'fishbone-line')
        .attr('stroke-width', 2)
        .attr('stroke', '#333');

      // Draw fish head
      svg.append('path')
        .attr('d', `M ${spineEndX + 10},${centerY} L ${spineEndX},${centerY - 10} L ${spineEndX},${centerY + 10} Z`)
        .attr('class', 'fishbone-head')
        .attr('fill', '#333');

      // Draw problem label
      svg.append('text')
        .attr('x', spineEndX + 20)
        .attr('y', centerY - 15)
        .attr('text-anchor', 'middle')
        .attr('class', 'fishbone-problem')
        .style('font-size', '12px')
        .text('Masalah Utama');

      // Draw category bones
      const categories = Object.keys(this.analysisData).filter(cat => this.analysisData[cat]?.length > 0);
      const boneLength = 100;
      const boneAngle = 30; // Degrees

      categories.forEach((category, i) => {
        const isUpper = i % 2 === 0; // Alternate between upper and lower
        const angleRad = isUpper 
          ? (90 - boneAngle) * Math.PI/180 
          : (90 + boneAngle) * Math.PI/180;
        
        const boneX = spineStartX + (i + 1) * (spineLength / (categories.length + 1));
        const boneY = centerY;
        const endX = boneX + boneLength * Math.cos(angleRad);
        const endY = boneY + boneLength * Math.sin(angleRad) * (isUpper ? -1 : 1);

        // Draw bone line
        svg.append('line')
          .attr('x1', boneX)
          .attr('y1', boneY)
          .attr('x2', endX)
          .attr('y2', endY)
          .attr('class', 'fishbone-bone')
          .attr('stroke', utils.getCategoryHexColor(category))
          .attr('stroke-width', 1.5);

        // Draw category label
        svg.append('text')
          .attr('x', endX + (isUpper ? -5 : 5))
          .attr('y', endY + (isUpper ? -15 : 20))
          .attr('text-anchor', isUpper ? 'end' : 'start')
          .attr('class', 'fishbone-category')
          .style('font-size', '10px')
          .style('fill', utils.getCategoryHexColor(category))
          .text(utils.formatCategoryName(category));

        // Draw causes
        const causes = this.analysisData[category];
        const causeSpacing = boneLength / (causes.length + 1);
        
        causes.forEach((causeId, j) => {
          const cause = this.allData[category]?.find(item => item.id === causeId);
          if (!cause) return;

          const t = (j + 1) / (causes.length + 1);
          const cx = boneX + t * boneLength * Math.cos(angleRad);
          const cy = boneY + t * boneLength * Math.sin(angleRad) * (isUpper ? -1 : 1);
          
          const branchLength = 30;
          const branchAngle = angleRad + (isUpper ? -Math.PI/2 : Math.PI/2);
          const branchX = cx + branchLength * Math.cos(branchAngle);
          const branchY = cy + branchLength * Math.sin(branchAngle);

          // Draw branch line
          svg.append('line')
            .attr('x1', cx)
            .attr('y1', cy)
            .attr('x2', branchX)
            .attr('y2', branchY)
            .attr('class', 'fishbone-sub-bone')
            .attr('stroke', utils.getCategoryHexColor(category))
            .attr('stroke-width', 1);

          // Draw cause dot
          const dot = svg.append('circle')
            .attr('cx', branchX)
            .attr('cy', branchY)
            .attr('r', 4)
            .attr('class', 'fishbone-cause')
            .attr('fill', utils.getPriorityHexColor(cause.priority))
            .attr('aria-label', `Penyebab: ${cause.cause}, Prioritas: ${cause.priority}`)
            .attr('role', 'button')
            .attr('tabindex', '0')
            .datum({cause, category});

          // Add tooltip interaction
          this.setupCauseInteractions(dot, svg);
        });
      });

      // Draw legend
      this.drawLegend(svg, width);
    } catch (error) {
      console.error('Error rendering fishbone diagram:', error);
    }
  }

  setupCauseInteractions(dot, svg) {
    const showTooltip = (event, d) => {
      this.tooltip
        .html(`
          <div class="fw-bold">${d.cause.cause}</div>
          <div class="small mt-1">${utils.truncateText(d.cause.description, 100)}</div>
          <div class="mt-2">
            <span class="badge bg-${utils.getPriorityColor(d.cause.priority)}">
              ${d.cause.priority || 'Medium'}
            </span>
            <span class="badge bg-${utils.getCategoryColor(d.category)}">
              ${utils.formatCategoryName(d.category)}
            </span>
          </div>
        `)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 30}px`)
        .style('opacity', 1)
        .attr('aria-hidden', 'false');
    };

    const hideTooltip = () => {
      this.tooltip
        .style('opacity', 0)
        .attr('aria-hidden', 'true');
    };

    const highlightRelated = (d) => {
      if (!d.cause.solutions?.length) return;
      
      svg.selectAll('.fishbone-cause')
        .attr('stroke', null)
        .attr('stroke-width', null)
        .attr('r', 4);
      
      dot.attr('stroke', 'white')
        .attr('stroke-width', 1.5)
        .attr('r', 5);
      
      const matchingCauses = this.solutionRelationships[d.cause.id] || [];
      
      svg.selectAll('.fishbone-cause')
        .filter(node => matchingCauses.includes(node.cause.id))
        .attr('stroke', '#ff0')
        .attr('stroke-width', 1.5)
        .attr('r', 5);
    };

    dot.on('mouseover', showTooltip)
       .on('mouseout', hideTooltip)
       .on('click', (event, d) => highlightRelated(d))
       .on('keypress', function(event, d) {
           if (event.key === 'Enter' || event.key === ' ') {
               event.preventDefault();
               highlightRelated(d);
           }
       });
  }

  drawLegend(svg, width) {
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120}, 20)`);
    
    const priorities = [
      { label: 'Critical', color: '#dc3545' },
      { label: 'High', color: '#fd7e14' },
      { label: 'Medium', color: '#ffc107' },
      { label: 'Low', color: '#28a745' }
    ];
    
    priorities.forEach((priority, i) => {
      legend.append('circle')
        .attr('cx', 10)
        .attr('cy', 10 + i * 20)
        .attr('r', 4)
        .attr('fill', priority.color);
      
      legend.append('text')
        .attr('x', 20)
        .attr('y', 10 + i * 20)
        .attr('dy', '0.35em')
        .text(priority.label)
        .style('font-size', '10px');
    });
  }
}