import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * StorageService wraps @ionic/storage-angular to provide a simple
 * key-value persistence layer backed by IndexedDB (browser) or
 * SQLite (native devices via Cordova).
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);

  private _storage: Storage | null = null;

  /**
   * Must be called once during app initialization (AppComponent.ngOnInit).
   * Creates and wires the underlying storage driver.
   */
  async init(): Promise<void> {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  async get(key: string): Promise<any> {
    return this._storage?.get(key);
  }

  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  async clear(): Promise<void> {
    await this._storage?.clear();
  }
}
