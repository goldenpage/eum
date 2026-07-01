import {Link} from 'react-router';

const NotFoundPage = () => {
  return (
    <main className="not-found">
      <section className="not-found__content">
        <p className="not-found__code">404</p>

        <h1 className="not-found__title">요청하신 식자재를 찾지 못했습니다</h1>

        <p className="not-found__description">
          입력한 주소가 잘못되었거나, 해당 페이지가 이동 또는 삭제되었을 수
          있습니다.
        </p>

        <div className="not-found__actions">
          <Link
            to="/food-materials"
            className="not-found__button not-found__button--primary"
          >
            식자재 목록으로
          </Link>

          <Link
            to="/"
            className="not-found__button not-found__button--secondary"
          >
            홈으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
