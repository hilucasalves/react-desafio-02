import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { apiGetCities, apiGetElections } from './api/api';

export default function App() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingElections, setLoadingElections] = useState(true);

  const [cities, setCities] = useState([]);
  const [currentElections, setCurrentElections] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    async function getBackendData() {
      const backendCities = await apiGetCities();
      setCities(backendCities);
      setSelectedCity(backendCities[0].id);
      setLoadingPage(false);
    }
    getBackendData();
  }, []);

  useEffect(() => {
    if (!selectedCity) {
      return;
    }
    async function getBackendElections() {
      setLoadingElections(true);
      const backendElecions = await apiGetElections(selectedCity);
      setCurrentElections(backendElecions);
      setLoadingElections(false);
    }
    getBackendElections();
  }, [selectedCity]);

  function handleCityChange(event) {
    const newCityId = event.currentTarget.value;
    setSelectedCity(newCityId);
  }

  let selectCityJsx = (
    <div className="text-center mt-4">
      <ClipLoader />
    </div>
  );

  let mainJsx = loadingPage ? null : (
    <div className="text-center mt-4">
      <ClipLoader />
    </div>
  );

  if (!loadingPage) {
    selectCityJsx = (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <select value={selectedCity} onChange={handleCityChange}>
            {cities.map(({ id, name }) => {
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }

  if (!loadingElections) {
    const { city, elections } = currentElections;
    const { name: cityName, absense, presence, votingPopulation } = city;

    mainJsx = (
      <div className="text-center">
        <h2 className="font-semibold text xl my-4">Eleições em {cityName}</h2>
        <ul>
          <li>
            <strong>População:</strong> {votingPopulation}
          </li>
          <li>
            <strong>Abstenção:</strong> {absense}
          </li>
          <li>
            <strong>Total de Votos:</strong> {presence}
          </li>
        </ul>
        <div className="flex flex-col">
          <table className="mt-4">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th className="w-16">Posição</th>
                <th className="w-32">Candidato</th>
                <th className="w-16">Votos</th>
                <th className="w-16">%</th>
                <th className="w-16">Eleito?</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election, index) => {
                const { id, votes, candidateName, candidateUserName } =
                  election;

                const percent = (votes / presence) * 100;
                const won = index === 0;
                return (
                  <tr key={id}>
                    <td>
                      <img
                        src={`/img/${candidateUserName}.png`}
                        alt={candidateName}
                        className="rounded-full"
                        width={36}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{candidateName}</td>
                    <td>{votes}</td>
                    <td>{percent.toFixed(2)}</td>
                    <td>{won ? 'Sim' : 'Não'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <div className="bg-gray-100 mx-auto p-4">
          <h1 className="text-center font-semibold text-xl">react-elections</h1>
        </div>
      </header>
      <main>
        {selectCityJsx} {mainJsx}
      </main>
    </div>
  );
}
