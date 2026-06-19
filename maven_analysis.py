import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Paths
DATA_DIR = r"D:\Data Science\My Portfolio\Maven+Fuzzy+Factory"
OUTPUT_IMG = r"D:\Data Science\My Portfolio\maven_seaborn_dashboard.png"

def generate_dashboard():
    print("Running Python Matplotlib & Seaborn analysis...")
    
    # 1. Load Data
    orders = pd.read_csv(os.path.join(DATA_DIR, "orders.csv"))
    sessions = pd.read_csv(os.path.join(DATA_DIR, "website_sessions.csv"))
    products = pd.read_csv(os.path.join(DATA_DIR, "products.csv"))
    refunds = pd.read_csv(os.path.join(DATA_DIR, "order_item_refunds.csv"))
    
    # 2. Parse Dates and Extract Year-Month
    orders['created_at'] = pd.to_datetime(orders['created_at'])
    orders['month'] = orders['created_at'].dt.to_period('M')
    
    sessions['created_at'] = pd.to_datetime(sessions['created_at'])
    sessions['month'] = sessions['created_at'].dt.to_period('M')
    
    refunds['created_at'] = pd.to_datetime(refunds['created_at'])
    
    # 3. Monthly Metrics Computations
    # Sessions
    monthly_sessions = sessions.groupby('month').size().reset_index(name='sessions')
    
    # Orders & Revenue & Cogs
    monthly_orders = orders.groupby('month').agg(
        orders=('order_id', 'count'),
        revenue=('price_usd', 'sum'),
        cogs=('cogs_usd', 'sum')
    ).reset_index()
    
    # Refunds (Mapped to Order month)
    order_refunds = refunds.merge(orders, on='order_id', how='inner')
    monthly_refunds = order_refunds.groupby('month').agg(
        refunds_count=('order_item_refund_id', 'count'),
        refund_amount=('refund_amount_usd', 'sum')
    ).reset_index()
    
    # Merge all monthly metrics
    df = pd.merge(monthly_sessions, monthly_orders, on='month', how='left').fillna(0)
    df = pd.merge(df, monthly_refunds, on='month', how='left').fillna(0)
    
    # Calculations
    df['conv_rate'] = (df['orders'] / df['sessions']) * 100
    df['refund_rate'] = (df['refunds_count'] / df['orders']) * 100
    df['profit'] = df['revenue'] - df['cogs'] - df['refund_amount']
    df['month_str'] = df['month'].astype(str)
    
    # 4. Product-wise sales trends
    # Merge order items with products
    order_items = pd.read_csv(os.path.join(DATA_DIR, "order_items.csv"))
    order_items['created_at'] = pd.to_datetime(order_items['created_at'])
    order_items['month'] = order_items['created_at'].dt.to_period('M')
    
    prod_sales = order_items.merge(products, on='product_id', how='inner')
    prod_monthly = prod_sales.groupby(['month', 'product_name']).size().reset_index(name='orders')
    prod_monthly['month_str'] = prod_monthly['month'].astype(str)

    # 5. Styling Configuration (Dark Mode matching the webpage theme)
    plt.style.use('dark_background')
    
    fig, axes = plt.subplots(2, 2, figsize=(18, 14), facecolor='#161922')
    fig.suptitle('Maven Fuzzy Factory - E-Commerce Analytics Dashboard\nGenerated via Matplotlib & Seaborn', 
                 fontsize=22, fontweight='bold', color='#00f2fe', family='sans-serif', y=0.96)
    
    # Accent colors
    cyan = '#00f2fe'
    blue = '#4facfe'
    green = '#00ff87'
    yellow = '#eab308'
    red = '#ef4444'
    violet = '#8b5cf6'
    
    # Subplot 1: Revenue vs Profit Growth
    ax1 = axes[0, 0]
    ax1.set_facecolor('#0d0f14')
    sns.barplot(data=df, x='month_str', y='revenue', ax=ax1, color=blue, alpha=0.7, label='Gross Revenue')
    ax1_line = ax1.twinx()
    sns.lineplot(data=df, x='month_str', y='profit', ax=ax1_line, color=green, linewidth=3, marker='o', label='Net Profit')
    
    ax1.set_title('Monthly Revenue & Net Profit Growth', fontsize=14, fontweight='bold', pad=15, color=cyan)
    ax1.set_xlabel('Month', fontsize=11, labelpad=10)
    ax1.set_ylabel('Revenue ($)', fontsize=11)
    ax1_line.set_ylabel('Net Profit ($)', fontsize=11)
    ax1.set_xticks(range(len(df)))
    ax1.set_xticklabels(df['month_str'], rotation=45, ha='right', fontsize=9)
    ax1.grid(True, color='#21262d', alpha=0.3)
    
    # Custom legends consolidation
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax1_line.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left')
    
    # Subplot 2: Sessions Traffic & Conversion Rate
    ax2 = axes[0, 1]
    ax2.set_facecolor('#0d0f14')
    sns.barplot(data=df, x='month_str', y='sessions', ax=ax2, color=cyan, alpha=0.6, label='Traffic Sessions')
    ax2_line = ax2.twinx()
    sns.lineplot(data=df, x='month_str', y='conv_rate', ax=ax2_line, color=yellow, linewidth=3, marker='s', label='Conversion Rate (%)')
    
    ax2.set_title('Traffic Sessions & Conversion Rate Trend', fontsize=14, fontweight='bold', pad=15, color=cyan)
    ax2.set_xlabel('Month', fontsize=11, labelpad=10)
    ax2.set_ylabel('Sessions', fontsize=11)
    ax2_line.set_ylabel('Conversion Rate (%)', fontsize=11)
    ax2.set_xticks(range(len(df)))
    ax2.set_xticklabels(df['month_str'], rotation=45, ha='right', fontsize=9)
    ax2.grid(True, color='#21262d', alpha=0.3)
    
    # Legends
    lines1, labels1 = ax2.get_legend_handles_labels()
    lines2, labels2 = ax2_line.get_legend_handles_labels()
    ax2.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

    # Subplot 3: Product Performance Breakdown
    ax3 = axes[1, 0]
    ax3.set_facecolor('#0d0f14')
    
    # Format product labels for legend
    prod_monthly['Product'] = prod_monthly['product_name'].str.replace('The ', '')
    sns.lineplot(data=prod_monthly, x='month_str', y='orders', hue='Product', ax=ax3, linewidth=2.5, palette='Set2')
    
    ax3.set_title('Product Monthly Sales Volume (Orders)', fontsize=14, fontweight='bold', pad=15, color=cyan)
    ax3.set_xlabel('Month', fontsize=11, labelpad=10)
    ax3.set_ylabel('Orders Count', fontsize=11)
    ax3.set_xticks(range(len(df)))
    ax3.set_xticklabels(df['month_str'], rotation=45, ha='right', fontsize=9)
    ax3.grid(True, color='#21262d', alpha=0.3)
    ax3.legend(title='Product Line', loc='upper left')

    # Subplot 4: Refund Rate & Losses
    ax4 = axes[1, 1]
    ax4.set_facecolor('#0d0f14')
    sns.barplot(data=df, x='month_str', y='refund_amount', ax=ax4, color=red, alpha=0.6, label='Refund Lost ($)')
    ax4_line = ax4.twinx()
    sns.lineplot(data=df, x='month_str', y='refund_rate', ax=ax4_line, color=violet, linewidth=2.5, marker='x', label='Refund Rate (%)')
    
    ax4.set_title('Monthly Refund Loss & Refund Claims Rate', fontsize=14, fontweight='bold', pad=15, color=cyan)
    ax4.set_xlabel('Month', fontsize=11, labelpad=10)
    ax4.set_ylabel('Refund Lost ($)', fontsize=11)
    ax4_line.set_ylabel('Refund Rate (%)', fontsize=11)
    ax4.set_xticks(range(len(df)))
    ax4.set_xticklabels(df['month_str'], rotation=45, ha='right', fontsize=9)
    ax4.grid(True, color='#21262d', alpha=0.3)
    
    # Legends
    lines1, labels1 = ax4.get_legend_handles_labels()
    lines2, labels2 = ax4_line.get_legend_handles_labels()
    ax4.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

    plt.tight_layout(rect=[0, 0.03, 1, 0.93])
    
    # Save fig
    plt.savefig(OUTPUT_IMG, dpi=120, bbox_inches='tight', facecolor='#161922')
    plt.close()
    
    print(f"Python Matplotlib & Seaborn dashboard generated at: {OUTPUT_IMG}")

if __name__ == '__main__':
    generate_dashboard()
