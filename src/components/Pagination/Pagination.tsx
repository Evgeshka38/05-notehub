import ReactPaginateImport from 'react-paginate';

import css from './Pagination.module.css';

const ReactPaginate =
  (
    ReactPaginateImport as unknown as {
      default?: typeof ReactPaginateImport;
    }
  ).default ?? ReactPaginateImport;

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  onChange,
}: PaginationProps) => {
  const handlePageChange = ({
    selected,
  }: {
    selected: number;
  }) => {
    onChange(selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={handlePageChange}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
      breakLabel="..."
    />
  );
}

export default Pagination;