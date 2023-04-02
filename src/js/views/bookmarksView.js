import View from './View.js';
import priviewView from './priviewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find recipes and bookmark it!';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => priviewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
