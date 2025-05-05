type VictoryScreenProps = {
  onRestart: () => void;
};

const VictoryScreen = ({ onRestart }: VictoryScreenProps) => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#e0f7fa',
      color: '#222',
      fontSize: 32,
    }}
  >
    <div style={{ fontSize: 80, marginBottom: 24 }}>🛵🍔</div>
    <div style={{ marginBottom: 24 }}>You win! Wolt delivery is here!</div>
    <button style={{ fontSize: 24, padding: '12px 32px' }} onClick={onRestart}>
      Play Again
    </button>
  </div>
);

export default VictoryScreen;
