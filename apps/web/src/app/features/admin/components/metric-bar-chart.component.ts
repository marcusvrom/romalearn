import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface MetricBarChartItem {
  label: string;
  value: number;
  formattedValue?: string;
  detail?: string;
}

@Component({
  selector: 'rl-metric-bar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="chart" [attr.aria-label]="title()">
      <header>
        <div>
          <h3>{{ title() }}</h3>
          @if (description()) { <p>{{ description() }}</p> }
        </div>
      </header>

      @if (items().length === 0) {
        <div class="empty" role="status">
          <strong>Sem dados suficientes</strong>
          <p>{{ emptyMessage() }}</p>
        </div>
      } @else {
        <div class="plot" role="img" [attr.aria-label]="accessibleSummary()">
          @for (item of items(); track item.label) {
            <div class="row">
              <div class="labels">
                <span>{{ item.label }}</span>
                <strong>{{ item.formattedValue ?? item.value }}</strong>
              </div>
              <div class="track" aria-hidden="true">
                <span [style.width.%]="percentage(item.value)"></span>
              </div>
              @if (item.detail) { <small>{{ item.detail }}</small> }
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .chart { display: grid; gap: var(--rl-space-4); }
    h3, p { margin: 0; }
    h3 { font-size: var(--rl-text-base); }
    header p { margin-top: var(--rl-space-1); color: var(--rl-text-muted); font-size: var(--rl-text-sm); }
    .plot { display: grid; gap: var(--rl-space-4); }
    .row { display: grid; gap: var(--rl-space-2); }
    .labels { display: flex; justify-content: space-between; gap: var(--rl-space-3); font-size: var(--rl-text-sm); }
    .labels span { min-width: 0; overflow-wrap: anywhere; }
    .labels strong { flex: 0 0 auto; font-variant-numeric: tabular-nums; }
    .track { height: .75rem; overflow: hidden; border-radius: 999px; background: var(--rl-surface-muted); }
    .track span { display: block; min-width: 2px; height: 100%; border-radius: inherit; background: var(--rl-brand-500); transition: width var(--rl-transition-base); }
    small { color: var(--rl-text-subtle); }
    .empty { display: grid; gap: var(--rl-space-2); padding: var(--rl-space-6); border: 1px dashed var(--rl-border); border-radius: var(--rl-radius-md); text-align: center; }
    .empty p { color: var(--rl-text-muted); }
    @media (prefers-reduced-motion: reduce) { .track span { transition: none; } }
  `],
})
export class MetricBarChartComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly items = input<MetricBarChartItem[]>([]);
  readonly emptyMessage = input<string>('Os dados aparecerão quando houver registros no período selecionado.');

  readonly maximum = computed(() => Math.max(0, ...this.items().map((item) => item.value)));
  readonly accessibleSummary = computed(() =>
    this.items().map((item) => `${item.label}: ${item.formattedValue ?? item.value}`).join('; '),
  );

  percentage(value: number): number {
    const maximum = this.maximum();
    return maximum <= 0 ? 0 : Math.max(0, Math.min(100, (value / maximum) * 100));
  }
}
