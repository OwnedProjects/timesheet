import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncrypService } from '../encryp.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
	dayrows: any = null;
	userdet: any = null;
	selectedday: any = null;
	todaydt: any = new Date().getDate();
	currentmnth: any = true;
	inhours: any = null;
	inmins: any = null;
	outhours: any = null;
	outmins: any = null;
	comments: any = null;
	successmsg: any = false;
	disablefields: any = false;
	greaterthantoday: any = false;
	selectedmonth: any = new Date().getTime();
	danger: any = false;
	success: any = false;
	constructor(private _router: Router, private _enc: EncrypService, private _db: AngularFirestore) {}

	ngOnInit() {
		if (sessionStorage) {
			if (!sessionStorage.getItem('uid')) {
				this._router.navigate([ '/signin' ]);
				return;
			} else {
				let user = sessionStorage.getItem('uid');
				this.userdet = this._enc.decryptObj(user);
				delete this.userdet.passwd;
				//console.log(this.userdet);
			}
		}
		let dt = new Date().getTime();
		this.printCurrentMonthGrid(dt);
	}

	printCurrentMonthGrid(dt) {
		let currdate = new Date(dt);
		let mntstartdt = 1;
		let mntenddt = new Date(currdate.getFullYear(), currdate.getMonth() + 1, 0).getDate();

		/**
     * Get Collection data
     */
		let docdata = this._db.collection(this.userdet.email).valueChanges().subscribe((Response) => {
			let tmpdate = new Date();
			tmpdate.setDate(1);
			tmpdate.setMonth(currdate.getMonth());
			tmpdate.setHours(0, 0, 0, 0);
			let tmpenddt = new Date();
			tmpenddt.setDate(mntenddt);
			tmpenddt.setMonth(currdate.getMonth());
			tmpenddt.setHours(23, 59, 59, 999); //Till last millisec
			//console.log(tmpdate, currdate);
			//console.log(Response);
			let firearr: any = [];
			for (let i in Response) {
				if (Response[i]['intime'] > tmpdate.getTime() && Response[i]['outtime'] < tmpenddt.getTime()) {
					firearr.push(Response[i]);
				}
			}
			//console.log(firearr);

			let rowarr = [];
			let tmpdt = currdate.setDate(1);
			let cnt = new Date(tmpdt).getDay();
			let dtarr = [];
			for (let i = mntstartdt; i <= mntenddt; i++) {
				let currdt = currdate.setDate(i);
				let dtobj = {
					noday: false,
					getdate: i,
					getday: this.returnWeekDay(new Date(currdt).getDay()),
					intime: '00:00',
					outtime: '00:00',
					ribbon: false,
					bgclass: null,
					totalHrs: null
				};
				for (let k in firearr) {
					let intm = new Date(firearr[k].intime);
					let outtm = new Date(firearr[k].outtime);
					if (intm.getDate() == i) {
						let inhr = intm.getHours() < 10 ? '0' + intm.getHours() : intm.getHours();
						let inmin = intm.getMinutes() < 10 ? '0' + intm.getMinutes() : intm.getMinutes();
						let outhr = outtm.getHours() < 10 ? '0' + outtm.getHours() : outtm.getHours();
						let outmin = outtm.getMinutes() < 10 ? '0' + outtm.getMinutes() : outtm.getMinutes();
						dtobj.intime = inhr + ':' + inmin;
						dtobj.outtime = outhr + ':' + outmin;
						dtobj.ribbon = true;
						let diff = new Date(outtm).getTime() - new Date(intm).getTime();
						dtobj.totalHrs = (diff / 36e5).toFixed(2);
						console.log(diff);
						if (diff < 28800000) {
							dtobj.bgclass = 'danger';
						} else if (diff < 32400000) {
							dtobj.bgclass = 'warning';
						} else {
							dtobj.bgclass = 'success';
						}
						break;
					}
				}

				dtarr.push(dtobj);
				if (cnt % 7 == 0) {
					rowarr.push(dtarr);
					dtarr = [];
					cnt = 0;
				}
				cnt++;
			}
			if (dtarr.length > 0) {
				rowarr.push(dtarr);
				dtarr = [];
			}
			//console.log(rowarr);
			//This loop is to adjust the empty blocks at the end of the month
			let tmpcnt = 8 - cnt;
			//console.log(tmpcnt);
			for (let j = 0; j < tmpcnt; j++) {
				let dtobj = {
					getdate: 0,
					noday: true,
					getday: 'no day'
				};
				console.log(tmpcnt);
				rowarr[rowarr.length - 1].push(dtobj);
			}

			this.dayrows = rowarr;
		});
	}

	returnWeekDay(day) {
		switch (day) {
			case 0:
				return 'Sun';
			case 1:
				return 'Mon';
			case 2:
				return 'Tue';
			case 3:
				return 'Wed';
			case 4:
				return 'Thu';
			case 5:
				return 'Fri';
			case 6:
				return 'Sat';
		}
	}

	logout() {
		sessionStorage.clear();
		this._router.navigate([ '/signin' ]);
	}

	getDateDetails(day) {
		this.disablefields = true;
		//console.log(day);
		let todaydate = new Date();
		todaydate.setHours(23, 59, 59, 999); //todays date last moment
		this.inhours = this.outhours = this.inmins = this.outmins = this.comments = null;
		this.selectedday = day;
		let dt = new Date();
		if (!this.currentmnth) {
			let mnt = new Date(this.selectedmonth);
			dt.setMonth(mnt.getMonth());
		}
		dt.setDate(day.getdate);
		dt.setHours(0);
		dt.setMinutes(0);
		dt.setSeconds(0);
		dt.setMilliseconds(0);
		let id = 'data_' + dt.getTime();

		if (dt.getTime() > todaydate.getTime()) {
			this.greaterthantoday = true;
		} else {
			this.greaterthantoday = false;
		}
		this._db.collection(this.userdet.email).doc(id).ref.get().then((Response) => {
			this.disablefields = false;
			if (Response.data()) {
				let data = Response.data();
				this.inhours = new Date(data.intime).getHours();
				this.inmins = new Date(data.intime).getMinutes();
				if (data.outtime) {
					this.outhours = new Date(data.outtime).getHours();
					this.outmins = new Date(data.outtime).getMinutes();
				}
				if (data.comments) {
					this.comments = data.comments;
				}
			}
		});
	}

	saveTimesheet() {
		//debugger;
		if (
			isNaN(parseInt(this.inhours)) ||
			isNaN(parseInt(this.inmins)) ||
			isNaN(parseInt(this.outhours)) ||
			isNaN(parseInt(this.outmins))
		) {
			alert('Please enter a valid date');
			return;
		}
		let dt = new Date();
		if (!this.currentmnth) {
			let mnt = new Date(this.selectedmonth);
			dt.setMonth(mnt.getMonth());
		}
		dt.setDate(this.selectedday.getdate);
		dt.setHours(0);
		dt.setMinutes(0);
		dt.setSeconds(0);
		dt.setMilliseconds(0);
		let id = 'data_' + dt.getTime();

		let tmpobj = {
			intime: null,
			outtime: null,
			comments: null
		};

		let indt = new Date(JSON.parse(JSON.stringify(dt.getTime())));
		let outdt = new Date(JSON.parse(JSON.stringify(dt.getTime())));
		//console.log(indt, outdt);

		indt.setHours(parseInt(this.inhours), parseInt(this.inmins), 0, 0);
		tmpobj.intime = indt.getTime();

		if (this.outhours && this.outmins) {
			outdt.setHours(parseInt(this.outhours), parseInt(this.outmins), 0, 0);
			//console.log(indt.getTime(), outdt.getTime());
			if (outdt.getTime() <= indt.getTime()) {
				alert('Your OUT time cannot be greater/equal to IN time, kindly rectify');
				return;
			} else {
				tmpobj.outtime = outdt.getTime();
			}
		}
		if (this.comments) {
			tmpobj.comments = this.comments;
		}

		//console.log(tmpobj);
		this._db.collection(this.userdet.email).doc(id).set(tmpobj);

		this.successmsg = 'Your time is updated successfully';
		let vm = this;
		window.setTimeout(function() {
			vm.successmsg = false;
		}, 2000);
	}

	setPreviousMonth() {
		let dt = new Date(this.selectedmonth);
		let todaydt = new Date();
		dt.setMonth(dt.getMonth() - 1);
		this.selectedmonth = dt.getTime();
		this.printCurrentMonthGrid(this.selectedmonth);

		if (dt.getMonth() == todaydt.getMonth() && dt.getFullYear() == todaydt.getFullYear()) {
			this.currentmnth = true;
		} else {
			this.currentmnth = false;
		}
	}

	setNextMonth() {
		let dt = new Date(this.selectedmonth);
		let todaydt = new Date();
		dt.setMonth(dt.getMonth() + 1);
		this.selectedmonth = dt.getTime();
		this.printCurrentMonthGrid(this.selectedmonth);

		if (dt.getMonth() == todaydt.getMonth() && dt.getFullYear() == todaydt.getFullYear()) {
			this.currentmnth = true;
		} else {
			this.currentmnth = false;
		}
	}

	setCurrentMonth() {
		let dt = new Date();
		this.selectedmonth = dt.getTime();
		this.printCurrentMonthGrid(this.selectedmonth);
		this.currentmnth = true;
	}
}
