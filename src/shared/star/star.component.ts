import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { DatabaseService } from '../../database.service';
import { takeUntil, switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Observable } from '@firebase/util';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'drills-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarComponent implements OnInit, OnDestroy {
/** The ID of the drill. */
  @Input() id!: string;
  /** Whether the current entity has been starred or not. */
  starred = new BehaviorSubject<boolean>(false);
  private readonly ngUnsubscribe = new ReplaySubject<void>();

  /**
   * Emits whenever the starring state is toggled in the UI. The boolean value
   * is whether it was starred or unstarred.
   */
  @Output() readonly toggle = new EventEmitter<boolean>();

  /**
   * Emits whenever the starring state is saved successfully in
   * Datahub. The boolean value it emits will correspond to whether or not the
   * entity was starred.
   */
  @Output() readonly toggleSuccess = new EventEmitter<boolean>();

  /** Emits whenever the saving the star state is unsuccessful. */
  @Output() readonly toggleError = new EventEmitter<{}>();
  constructor(
      private readonly dbService: DatabaseService,
      private readonly changeDetectorRef: ChangeDetectorRef) {
    this.toggle
        .pipe(
            takeUntil(this.ngUnsubscribe),
            map(
                (starred) => this.dbService.updateStarredDrill(this.id, starred))
            )
        .subscribe(
            () => {
              // this.toggleSuccess.next(this.starred);
            },
            (err) => {
              this.toggleError.next(err);
            });
  }

  ngOnInit(): void {
    this.dbService.isDrillStarred(this.id).subscribe((currentStarred) => {
      this.starred.next(currentStarred);
    });
  }


  /** Star or unstar the entity in Datahub. */
  toggleStar(): void {
    this.toggle.emit(!this.starred.getValue());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
