import Spline from '@splinetool/react-spline';

export default function CharacterAvatar(): React.ReactElement {
  return (
    <>
      <style>{`
        iframe[data-spline] {
          background: #000000 !important;
          width: 100% !important;
          height: 100% !important;
        }
        .spline-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: #000000;
          overflow: hidden;
          border-radius: 12px;
        }
        .spline-container > * {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
      <div 
        className="spline-container"
        style={{ 
          width: '100%', 
          height: '16rem',
          background: '#000000',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Spline
          scene="https://prod.spline.design/AWqj0pOJXc73kVqV/scene.splinecode"
        />
      </div>
    </>
  );
}
