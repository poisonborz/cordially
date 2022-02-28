
import PhotoSwipeLightbox from './lightbox-ex.js'
import 'normalizecss/normalize.css'
import '../styles/lightbox.css'
import '../styles/main.scss'

const langElements = Array.from(document.querySelectorAll('*'))
    .filter(
        (e) => Array.from(e.attributes).filter(
            ({ name, value }) => name.startsWith('data-lang')).length
    )

export const switchLanguage = (suppliedLangcode) => {

    const langcode = suppliedLangcode || localStorage.getItem('langcode')

    langElements.forEach(e => {
        const translationText = e.getAttribute('data-lang-' + langcode)

        if (e.hasAttribute('placeholder')) {
            e.setAttribute('placeholder', translationText)
        } else if (e.hasAttribute('value')) {
            e.setAttribute('value', translationText)
        } else {
            e.innerHTML = translationText
        }
    })

    if (suppliedLangcode) localStorage.setItem('langcode', suppliedLangcode)
}

const sights = document.querySelectorAll('#sights')

const lightbox = new PhotoSwipeLightbox({
    gallery: sights.length ? '#sights' : '#locationInfo_pics',
    zoom: false,
    children: sights.length ? '#sights > div > a' : 'a',
    pswpModule: '/scripts/lightbox.js'
})

lightbox.init()
