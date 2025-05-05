type GameOverScreenProps = {
  onRestart: () => void;
};

const GameOverScreen = ({ onRestart }: GameOverScreenProps) => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#222',
      color: '#fff',
      fontSize: 32,
    }}
  >
    <div style={{ fontSize: 80, marginBottom: 24 }}>🦈🚀</div>
    <div style={{ marginBottom: 24 }}>Game Over! (Shark/Rocket Ending)</div>
    <button style={{ fontSize: 24, padding: '12px 32px' }} onClick={onRestart}>
      Restart
    </button>
  </div>
);

export default GameOverScreen;
