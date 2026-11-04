const flags = {
  'Brazil': 'br',
  'Argentina': 'ar',
  'France': 'fr',
  'Germany': 'de',
  'Portugal': 'pt',
  'Morocco': 'ma',
  'England': 'gb-eng',
  'Spain': 'es',
  'Italy': 'it',
  'Netherlands': 'nl',
  'Belgium': 'be'
};

const CountryFlag = ({ country, size = 'md', className = '' }) => {
  const countryCode = flags[country] || '';
  
  let dimensions = { width: '40px', height: '30px' };
  if (size === 'sm') {
    dimensions = { width: '32px', height: '24px' };
  } else if (size === 'lg') {
    dimensions = { width: '64px', height: '48px' };
  }

  if (!countryCode) {
    return <span className={className}>No flag</span>;
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      alt={country}
      style={{
        ...dimensions,
        objectFit: 'cover',
        borderRadius: '4px'
      }}
      className={className}
      title={country}
    />
  );
};

export default CountryFlag;
