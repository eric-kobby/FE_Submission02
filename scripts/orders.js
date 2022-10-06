(function () {

  const prevAction = document.querySelector('.arrow-left');
  const nextAction = document.querySelector('.arrow-right');
  const search = document.querySelector('.search');
  const rows =  document.querySelector('#table-rows');
  const currentPageEl = document.querySelector('#current-page');
  const totalPagesEl = document.querySelector('#total-pages');

  let currentPage = 1;

  function updatePaginationDetails(total, page) {
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (currentPage === 1) prevAction.classList.add('d-none');
    if (currentPage === totalPages) nextAction.classList.add('d-none');
    if (currentPage > 1) prevAction.classList.remove('d-none');
    if (currentPage < totalPages) nextAction.classList.remove('d-none');

    totalPagesEl.textContent = totalPages;
    currentPageEl.textContent = page;
    currentPage = page;
  }

  /**
   * 
   * @param {string} status 
   */
  function getStatusElement(status) {
    switch (status) {
      case 'delivered':
        return `<span class="text-success">Delivered</span>`;
      case 'shipped':
        return `<span>Shipped</span>`;
      default:
        return `<span class="text-danger">Processing</span>`;
    }
  }
  /**
   * 
   * @param {Array<{
   * productName: string; 
   * date: string;
   * price: number;
   * status: string;
   * }>} orders 
   */
  function renderOrders(orders) {
    rows.replaceChildren('');
    for (const [_, order] of orders.entries()) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${order.productName}</td>
        <td>${order.date}</td>
        <td>${order.price}</td>
        <td>${getStatusElement(order.status)}</td>
      `;
      rows.appendChild(tr);
    }
  }

  /**
   * 
   * @param {Array} orders 
   * @returns 
   */
  function mapOrders(orders){
    return orders.map((order) => ({
      productName: order.product.name,
      price: 0,
      date: formatHelper.formatDate(new Date(order.created_at)),
      status: order.status
    }))
  }

  /**
   * 
   * @param {Function} func 
   * @param {number} delay 
   * @returns 
   */
  function debounceQuery(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer= setTimeout(() => func.apply(context, args), delay)
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {

    search.addEventListener('keyup', debounceQuery(async (e) => {
      const { orders, total, page } = await dataservice.getOrders(1, e.target.value);
      renderOrders(mapOrders(orders));
      updatePaginationDetails(total, page);
    }, 200));

    prevAction.addEventListener('click', async () => {
      currentPage--;
      const { orders, total, page } = await dataservice.getOrders(currentPage, search.value);
      //render orders
      renderOrders(mapOrders(orders));
      //update Buttons
      updatePaginationDetails(total, page);
    });

    nextAction.addEventListener('click', async () => {
      currentPage++;
      const { orders, total, page } = await dataservice.getOrders(currentPage, search.value);
      //render orders
      renderOrders(mapOrders(orders));
      updatePaginationDetails(total, page);
      //update Buttons
    });

    const { total, orders, page } = await dataservice.getOrders();
    renderOrders(mapOrders(orders));
    updatePaginationDetails(total, page);

  });
})();