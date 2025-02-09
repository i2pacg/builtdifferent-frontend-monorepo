import { Language } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { Repository } from 'pinia-orm'

export class LanguageRepository extends Repository<Language> {
  use = Language

  availableLanguages(): Language[] {
    return this.all()
  }
}
