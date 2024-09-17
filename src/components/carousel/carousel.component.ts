import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, AfterViewInit {
  selectedProduct = 0;
  products = [
    { name: 'Produto 1', image: 'assets/image/cell.png' },
    { name: 'Produto 2', image: 'assets/image/cell2.png' },
  ];

  @ViewChild('carousel', { static: false }) carouselElement!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Inicializa dados se necessário
  }

  ngAfterViewInit() {
    // Centraliza o primeiro produto ao carregar
    this.scrollToSelectedProduct();
    if (this.carouselElement) {
      this.Scroll(this.carouselElement.nativeElement);
    } else {
      console.error('Elemento do carrossel não encontrado');
    }

    // Adiciona o evento de scroll
    this.renderer.listen(
      this.carouselElement.nativeElement,
      'scroll',
      (event) => this.onScroll(event)
    );
  }

  selectProduct(index: number) {
    this.selectedProduct = index;
    this.scrollToSelectedProduct();
  }

  scrollToSelectedProduct() {
    const carousel = this.carouselElement.nativeElement;
    const selectedItem = carousel.querySelectorAll('.carousel-item')[
      this.selectedProduct
    ] as HTMLElement;
    const offsetLeft =
      selectedItem.offsetLeft -
      (carousel.offsetWidth / 2 - selectedItem.offsetWidth / 2);
    carousel.scrollTo({
      left: offsetLeft,
      behavior: 'smooth',
    });
  }

  onScroll(event: Event) {
    this.Scroll(event.target as HTMLElement);
  }

  Scroll(carousel: HTMLElement) {
    const items = Array.from(
      carousel.querySelectorAll('.carousel-item')
    ) as HTMLElement[];
    const carouselCenter = carousel.offsetWidth / 2; // Centro do carrossel

    // Ajustar escala dos itens com base na distância do centro
    items.forEach((item: HTMLElement, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2; // Centro do item
      const distanceFromCenter = Math.abs(itemCenter - carouselCenter);

      // Ajuste de escala mais fluido e suave
      const scale = this.calculateScale(distanceFromCenter, carouselCenter);
      this.renderer.setStyle(item, 'transform', `scale(${scale})`);

      // Encontrar o item mais centralizado e atualizar o produto selecionado
      if (distanceFromCenter < itemRect.width / 2) {
        this.selectedProduct = index;
      }
    });
  }

  // Função para calcular a escala dinamicamente com base na distância do centro
  calculateScale(distance: number, maxDistance: number): number {
    const minScale = 0.9; // Escala mínima para itens distantes do centro
    const maxScale = 1.2; // Escala máxima para itens no centro
    const scaleFactor = 1 - distance / maxDistance; // Redução da escala com base na distância

    // Retorna uma escala entre minScale e maxScale
    return minScale + (maxScale - minScale) * Math.max(scaleFactor, 0);
  }
}
