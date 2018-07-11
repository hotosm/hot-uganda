// License: GPL. For details, see LICENSE file.
package org.openstreetmap.josm.plugins.kobomapper.actions;

import org.jdatepicker.JDatePicker;
import org.openstreetmap.josm.Main;
import org.openstreetmap.josm.actions.JosmAction;
import org.openstreetmap.josm.plugins.kobomapper.utils.GeoserverApi;
import org.openstreetmap.josm.tools.GBC;
import org.openstreetmap.josm.tools.Logging;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import static org.openstreetmap.josm.tools.I18n.marktr;
import static org.openstreetmap.josm.tools.I18n.tr;


@SuppressWarnings("serial")
public class MenuActionGetLayers extends JosmAction {

    public static final String NAME = marktr("Get Plot Boundaries");
    //MapView mv = MainApplication.getMap().mapView;

        private static final String[] groups = {
        "", tr("All Groups"),
        "001", "Group 1",  "002", "Group 2","003", "Group 3","004", "Group 4","005", "Group 5"};

        private static final String[] filters = {
        "", tr("All Time"),
        "001", "Today",  "002", "Yesterday","003", "This Week","004", "Last 2 weeks"};


    public MenuActionGetLayers() {
        super(tr(NAME), "boundary_icon.png", tr("Get Plot boundaries"), null, false);
    }

    @Override
    public void actionPerformed(ActionEvent arg0) {

        Logging.info("Getting boundaries...");
        Logging.debug("fetching boundaries");
        addNewLayer();

        
           
    }


    public static void addNewLayer() {

        String filter;
        String group;

        JLabel labelSectionNewLayer = new JLabel(tr("Add new mapped boundaries layer"));
        JPanel p = new JPanel(new GridBagLayout());


        JLabel labelStartDate = new JLabel(tr("Start Date"));
        final JDatePicker startDate = new JDatePicker();
        JLabel labelEndDate = new JLabel(tr("End Date"));
        final JDatePicker endDate = new JDatePicker();



        JLabel labelGroup = new JLabel(tr("Group"));
        final JComboBox<String> inputGroup = new JComboBox<>();
        final JComboBox<String> inputFilter = new JComboBox<>();
        for (int i = 1; i < groups.length; i += 2) {
            inputGroup.addItem(groups[i]);
        }
        inputGroup.setToolTipText(tr("<html>Group</html>"));
        if (!Main.pref.get("kobo.codegroup").equals("")) {
            for (int i = 0; i < groups.length; i += 2) {
                if (groups[i].equals(Main.pref.get("kobo.codegroup")))
                    inputGroup.setSelectedIndex(i/2);
        
            }
        }

        JLabel labelFilter = new JLabel(tr("Filter"));
        for (int i = 1; i < filters.length; i += 2) {
            inputFilter.addItem(filters[i]);
        }
        inputFilter.setToolTipText(tr("<html>Time Period</html>"));
        if (!Main.pref.get("kobo.filter").equals("")) {
            for (int i = 0; i < filters.length; i += 2) {
                if (filters[i].equals(Main.pref.get("kobo.cfilter")))
                    inputFilter.setSelectedIndex(i/2);
        
            }
        }

        p.add(labelSectionNewLayer, GBC.eol());
        p.add(labelGroup, GBC.std().insets(10, 0, 0, 0));
        p.add(inputGroup, GBC.eol().fill(GBC.HORIZONTAL).insets(5, 0, 0, 5));
        //p.add(labelFilter, GBC.std().insets(10, 0, 0, 0));
        //p.add(inputFilter, GBC.eol().fill(GBC.HORIZONTAL).insets(5, 0, 0, 5));

        p.add(labelStartDate, GBC.std().insets(10, 0, 0, 0));
        p.add(startDate, GBC.eol().fill(GBC.HORIZONTAL).insets(5, 0, 0, 5));
        p.add(labelEndDate, GBC.std().insets(10, 0, 0, 0));
        p.add(endDate, GBC.eol().fill(GBC.HORIZONTAL).insets(5, 0, 0, 5));
        JOptionPane pane = new JOptionPane(p, JOptionPane.INFORMATION_MESSAGE, JOptionPane.OK_CANCEL_OPTION, null) {
            private static final long serialVersionUID = 1L;

            @Override
            public void selectInitialValue() {
                //inputTown.requestFocusInWindow();
                //inputTown.selectAll();
            }
        };

        pane.createDialog(Main.parent, tr("Download Plot Boundaries")).setVisible(true);


        group = groups[inputGroup.getSelectedIndex()*2];
        Main.pref.put("kobo.group", group);

        filter = groups[inputFilter.getSelectedIndex()*2];
        Main.pref.put("kobo.filter", filter);

        Calendar c1 = (Calendar) startDate.getModel().getValue();

        Calendar c2 = (Calendar) endDate.getModel().getValue();

        final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        GeoserverApi client = new GeoserverApi();
        if(c1 != null) {
            Main.pref.put("kobo.start", sdf.format(c1.getTime()));
        }
        if(c2 != null) {
            Main.pref.put("kobo.end", sdf.format(c2.getTime()));
        }
        client.getLayer("hotosm:boundaries",c1 != null ? sdf.format(c1.getTime()) : null,c2 != null ? sdf.format(c2.getTime()) : null);


        //GeoserverApi client = new GeoserverApi();





    }
}
