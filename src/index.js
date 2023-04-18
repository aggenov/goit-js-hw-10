import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector('#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');
inputCountry.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  //   console.dir(evt);
  //   console.dir(evt.target);
  //   console.log(evt.target.value.trim());
  const inputValue = evt.target.value.trim();
  clearCountryInfo;
  if (!inputValue) {
    return;
  }
  fetchCountries(inputValue)
    .then(data => {
      //   console.log(data);
      //   console.log(data.length);
      clearCountryInfo();

      if (data.length > 10) {
        // clearCountryInfo();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if ((data.length <= 10) & (data.length > 1)) {
        clearCountryInfo();
        getSimpleMarkup(data);
      } else if (data.length === 1) {
        clearCountryInfo();
        getMarkup(data);
      }
    })
    .catch(err => {
      clearCountryInfo();
      Notify.failure('Oops, there is no country with that name');
    });
}

function clearCountryInfo() {
  listCountry.innerHTML = '';
  infoCountry.innerHTML = '';
}

function getSimpleMarkup(data) {
  const markup = data.map(createSimpleMarkup).join('');
  listCountry.innerHTML = markup;
  infoCountry.innerHTML = '';
  //   console.log('simple information');
  //   console.log(markup);
}

function createSimpleMarkup({ flags, name }) {
  return `
    <li class="country-item">
      <img
        class="country-flag"
        src="${flags.svg}"
        width="60px"
        height="40px"
      />
      <p class="country-name">${name.official}</p>
    </li>`;
}

function getMarkup(data) {
  //   console.log('detail information');
  //   console.dir(data);

  const markup = data.map(createMarkup).join('');
  listCountry.innerHTML = '';
  infoCountry.innerHTML = markup;
  console.log(markup);
}
function createMarkup({ flags, name, capital, population, languages }) {
  const langStr = Object.values(languages).join(',  '); //преобразуем значение поля languages из объекта в строку
  const formattingPopulation = new Intl.NumberFormat('ru-RU').format(
    population
  );
  return `
   <div class="country-item">
      <img
        class="country-flag"
        src="${flags.svg}"
        width="60px"
        height="40px"
      />
      <p class="country-name accent">${name.official}</p>
      </div>
      <div class="description">
      <p class="description-name">Capital: <span class="description-text">${capital}</span></p>
      <p class="description-name">Population: <span class="description-text">${formattingPopulation}</span></p>
      <p class="description-name">Languages: <span class="description-text">${langStr}</span></p>
      
      </div>
    `;
}
