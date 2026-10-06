import type { MallWithStatus } from '../../types/mall';

interface MallDetailsCardProps {
  mall: MallWithStatus;
  onClose: () => void;
}

export default function MallDetailsCard({
  mall,
  onClose,
}: MallDetailsCardProps) {
  const isOpen = mall.status === 'OPEN';

  return (
    <aside className="mall-details">
      <button
        type="button"
        className="mall-details__close"
        onClick={onClose}
        aria-label="Close mall details"
      >
        ×
      </button>

      <div className="mall-details__image-wrapper">
        <img
          src={mall.image}
          alt={mall.name}
          className="mall-details__image"
        />

        <div
          className={`mall-details__status ${
            isOpen
              ? 'mall-details__status--open'
              : 'mall-details__status--closed'
          }`}
        >
          <span className="status-dot"></span>
          {mall.status}
        </div>
      </div>

      <div className="mall-details__content">
        <p className="mall-details__eyebrow">
          {mall.city} · {mall.country}
        </p>

        <h2>{mall.name}</h2>

        <p className="mall-details__address">
          {mall.address}
        </p>

        <div className="mall-details__hours">
          <div>
            <span>Today</span>
            <strong>
              {mall.openingTime} – {mall.closingTime}
            </strong>
          </div>

          <div>
            <span>Local time</span>
            <strong>{mall.currentLocalTime}</strong>
          </div>
        </div>

        <div className="mall-details__actions">
          {mall.website && (
            <a
              href={mall.website}
              target="_blank"
              rel="noreferrer"
              className="mall-action mall-action--primary"
            >
              Visit Website
            </a>
          )}

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mall.latitude},${mall.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="mall-action"
          >
            Directions
          </a>
        </div>
      </div>
    </aside>
  );
}